import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/note.service';
import { type Note } from '../types/note';

const Dashboard: React.FC = () => {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 💡 신규 상태: 검색어 및 선택된 태그
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false); // 👈 추가: 태그 펼침 여부

    const observeTargetRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const isFetching = useRef(false);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatQuery, setChatQuery] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const [aiInsight, setAiInsight] = useState<string>('');
    const [isInsightLoading, setIsInsightLoading] = useState(false);

    // 💡 RAG 핵심 함수: 필터링된 메모들을 컨텍스트로 결합
    const askAIAboutNotes = async () => {
        if (!chatQuery.trim()) return;
        
        setIsChatLoading(true);
        setChatResponse(""); // 이전 응답 초기화

        // 1. 현재 화면에 보이는(필터링된) 메모들의 내용을 하나로 합침
        const context = filteredNotes
            .map(n => `[제목: ${n.title}] 내용: ${n.content}`)
            .join("\n\n");

        try {
            // 2. 서비스 호출 (프롬프트에 컨텍스트 주입)
            // noteService.askAI(chatQuery, context) 형태의 함수가 필요함
            const response = await noteService.askAI(chatQuery, context);
            setChatResponse(response);
        } catch (error) {
            setChatResponse("메모를 분석하는 중 오류가 발생했습니다.");
        } finally {
            setIsChatLoading(false);
        }
    };


    // 💡 실시간 필터링 로직 (RAG의 검색 엔진 역할)
    const filteredNotes = useMemo(() => {
        return allNotes.filter(note => {
            const matchesSearch = 
                (note.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (note.content?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (note.summary?.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true;
            
            return matchesSearch && matchesTag;
        });
    }, [allNotes, searchQuery, selectedTag]);

    // 💡 [수정] 필터링된 메모들의 태그만 동적으로 추출 + 검색 결과가 없으면 빈 배열 반환
    const availableTags = useMemo(() => {
        // 1. 검색 결과가 하나도 없다면 태그 목록을 완전히 비웁니다.
        if (filteredNotes.length === 0) {
            return [];
        }

        const tagsSet = new Set<string>();

        if (searchQuery.trim().length > 0) {
            // 2. 검색어가 입력되었을 때는 '현재 검색어로 필터링된 결과'에 포함된 태그들만 추출합니다.
            filteredNotes.forEach(note => {
                if (Array.isArray(note.tags)) {
                    note.tags.forEach(tag => tagsSet.add(tag));
                }
            });
        } else {
            // 3. 검색어가 없을 때는 전체 메모(allNotes)에서 태그를 추출하여 초기 상태를 보여줍니다.
            allNotes.forEach(note => {
                if (Array.isArray(note.tags)) {
                    note.tags.forEach(tag => tagsSet.add(tag));
                }
            });
        }

        return Array.from(tagsSet);
    }, [allNotes, filteredNotes, searchQuery]); // 👈 최신 상태 동기화를 위해 디펜던시 추가

    // 데이터 페칭 로직 (기존 유지)
    const fetchMoreNotes = useCallback(async() => {
        if (isLoading || isFetching.current || (allNotes.length > 0 && !hasMore)) return;
        isFetching.current = true;
        setIsLoading(true);
        try { 
            const response = await noteService.getNotes(page, 10);
            const { notes, pagination } = response;
            setAllNotes(prev => [...prev, ...notes]);
            setHasMore(page < pagination.totalPages);
            if (page < pagination.totalPages) setPage(prev => prev + 1);
        } catch (error) {
            console.error('메모 목록 불러오기 실패:', error);
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, [page, isLoading, hasMore, allNotes.length]);

    useEffect(() => { fetchMoreNotes(); }, []);
    
    useEffect(() => {
        if (!hasMore || isLoading || searchQuery) return; // 검색 중에는 무한 스크롤 일시 중지
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchMoreNotes(); },
            { threshold: 0.5 }
        )
        if (observeTargetRef.current) observer.observe(observeTargetRef.current);
        return () => observer.disconnect();
    }, [fetchMoreNotes, isLoading, hasMore, searchQuery]);

    useEffect(() => {
        if (searchQuery.length <2) {
            setAiInsight('');
            return;
        }

        // 2. 디바운스 타이머 설정 (0.8초)
        const timer = setTimeout(async () => {
            setIsInsightLoading(true);
            try {
                // AI에게 전달할 핵심 컨텍스트 구성
                const context = filteredNotes
                    .map(n => `- ${n.title}: ${n.summary || n.content.slice(0, 40)}`)
                    .join('\n');

                // 서비스 호출
                const insight = await noteService.getSearchInsight(context);
                setAiInsight(insight);
            } catch (error) {
                setAiInsight('인사이트를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsInsightLoading(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [searchQuery, filteredNotes.length]); // 검색어가 바뀔 때마다 실행

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 relative">
            {/* 로딩 UI (기존 유지) */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="flex items-center space-x-4 bg-gray-800/90 border border-blue-500/30 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
                        <div className="flex space-x-1.5">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm font-bold text-blue-400 tracking-tight">
                            기록을 불러오는 중...
                        </span>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto relative">
                
                {/* 1. 상단 헤더 & 검색 영역 */}
                <header className="mb-10 space-y-8 border-b border-gray-800 pb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <h1 className="text-3xl font-bold text-gray-100 tracking-tight flex items-center">
                            <span className="w-2 h-8 bg-blue-600 rounded-full mr-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]"></span>
                            AI Memory Lab
                        </h1>

                        {/* 💡 레이아웃 전환 컨트롤 UI: 배경을 더 어둡게(bg-gray-950/50) 설정하여 음각 느낌 부여 */}
                        <div className="flex bg-gray-950/50 p-1.5 rounded-2xl border border-gray-800 shadow-inner self-start">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 focus:outline-none ${
                                    viewMode === 'grid' 
                                    ? 'bg-gray-700 text-blue-400 shadow-lg scale-100 ring-1 ring-gray-600'
                                    : 'bg-gray-900 text-gray-400 hover:text-gray-200 scale-95 opacity-70'
                                }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                            </button>
                            
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 focus:outline-none ${
                                    viewMode === 'list' 
                                    ? 'bg-gray-700 text-blue-400 shadow-lg scale-100 ring-1 ring-gray-600' // 선택된 상태
                                    : 'bg-gray-900 text-gray-400 hover:text-gray-200 scale-95 opacity-70' // 선택 안됨
                                }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">List</span>
                            </button>
                        </div>
                    </div>

                    {/* 💡 검색 바 UI */}
                    <div className="relative group max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text"
                            placeholder="메모 내용, 제목, 또는 AI 요약 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-800/40 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-gray-800 transition-all outline-none text-gray-200 placeholder-gray-500 shadow-xl"
                        />
                    </div>

                    {/* 검색창 바로 아래 추가 */}
                    <div className={`transition-all duration-500 overflow-hidden ${aiInsight || isInsightLoading ? 'max-h-40 mb-8' : 'max-h-0'}`}>
                        <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/5 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4 shadow-inner">
                            <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                                <svg className={`w-5 h-5 text-blue-400 ${isInsightLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            
                            <div className="flex-1">
                                <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-1">AI Search Insight</h4>
                                {isInsightLoading ? (
                                    <div className="flex gap-1 items-center h-5">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                ) : (
                                    <p className="text-gray-300 text-sm leading-relaxed animate-in fade-in slide-in-from-left-2">
                                        {aiInsight}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {availableTags.length > 0 && (
                        /* 💡 태그 필터 영역 (최초 30개 제한 및 더보기/접기 토글 적용) */
                        <div className="flex flex-wrap gap-2 items-center">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    !selectedTag 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                            >
                                ALL
                            </button>
                            
                            {/* 💡 상태에 따라 30개만 자르거나 전체를 보여줌 */}
                            {(isTagsExpanded ? availableTags : availableTags.slice(0, 30)).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                        selectedTag === tag 
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                    }`}
                                >
                                    #{tag}
                                </button>
                            ))}

                            {/* 💡 태그가 30개보다 많을 때만 토글 버튼을 렌더링 */}
                            {availableTags.length > 30 && (
                                <button
                                    onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-950/40 border border-dashed border-gray-700 text-blue-400 hover:bg-gray-800 hover:text-blue-300 transition-all ml-1"
                                >
                                    <span>{isTagsExpanded ? '접기' : `더보기 (+${availableTags.length - 30})`}</span>
                                    <svg 
                                        className={`w-3 h-3 transition-transform duration-200 ${isTagsExpanded ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </header>

                {/* 2. 필터링된 메모 리스트 영역 */}
                <section className={`
                    ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-4'}
                `}>
                    {filteredNotes.map((note: Note) => {
                        const dateObj = new Date(note.updatedAt);
                        const dateStr = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                        const timeStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                        const tagsArray = note.tags !== null ? note.tags.slice(0,3) : [];

                        return (
                            <div 
                                key={note.id} 
                                onClick={() => navigate(`/note/${note.id}`)}
                                className={`group relative rounded-3xl bg-gray-800/20 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/40 shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden p-8
                                    ${viewMode === 'grid' ? 'min-h-[320px]' : 'min-h-[140px]'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[11px] font-mono text-blue-400/70 tracking-tighter bg-blue-500/5 px-2 py-1 rounded-md">
                                        {dateStr} {timeStr}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tagsArray.map((tag) => (
                                            <span key={tag} className="px-2 py-0.5 bg-gray-700/50 rounded-md text-[10px] text-gray-400 font-bold group-hover:text-blue-300 transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 transition-colors">
                                    {note.title || '분석 중인 메모...'}
                                </h2>

                                <div className="flex-1">
                                    <p className="text-gray-400 leading-relaxed text-[15px] line-clamp-3 italic mb-4">
                                        {note.summary ? `"${note.summary}"` : '요약 생성 중...'}
                                    </p>
                                    <p className={`text-gray-500 leading-relaxed text-[13px] line-clamp-2`}>
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* 데이터 없음 처리 */}
                {filteredNotes.length === 0 && (
                    <div className="py-40 text-center">
                        <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-gray-500 font-medium">찾으시는 메모가 없어요. 다시 검색해보시겠어요?</p>
                    </div>
                )}

                {/* 무한 스크롤 타겟 */}
                <div ref={observeTargetRef} className="h-20 w-full" />
                
                {/* FAB */}
                <button onClick={() => navigate('/workspace')} className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] z-50 transition-all hover:-translate-y-2 active:scale-95">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>

                {/* AI 채팅창 팝업 */}
                {isChatOpen && (
                    <div className="fixed bottom-28 right-6 w-[350px] sm:w-[420px] bg-[#0f172a] border border-gray-800 rounded-[2rem] shadow-2xl z-[60] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-500 shadow-blue-500/10">
                        
                        {/* 1. Header: 타이틀 변경 및 닫기 버튼 디자인 개선 */}
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600/20 to-transparent border-b border-gray-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-[15px] tracking-tight">Memory Insight</h3>
                                    <p className="text-[10px] text-blue-400/60 font-medium uppercase tracking-widest">Contextual AI Analysis</p>
                                </div>
                            </div>
                            
                           <button 
                                onClick={() => setIsChatOpen(false)} 
                                /* 💡 flex-shrink-0 를 추가해서 너비가 0이 되는 것을 방지합니다 */
                                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-gray-800/50 hover:bg-red-500/20 transition-all active:scale-95 group border border-gray-700/50"
                            >
                                <svg 
                                    /* 💡 여기서도 flex-shrink-0를 한 번 더 주면 안전합니다 */
                                    className="flex-shrink-0 w-5 h-5 text-white group-hover:text-red-400" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* 2. Message Area: 더 깔끔한 폰트와 여백 */}
                        <div className="p-6 h-[320px] overflow-y-auto custom-scrollbar">
                            {!chatResponse && !isChatLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-3 bg-gray-800/50 rounded-2xl">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed px-4">
                                        필터링된 <span className="text-blue-400 font-bold">{filteredNotes.length}개</span>의 메모 내에서<br/>
                                        궁금한 점을 분석해 드릴까요?
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                                        {['공통 키워드 요약', '연관 메모 찾기'].map(hint => (
                                            <button 
                                                key={hint}
                                                onClick={() => setChatQuery(hint)}
                                                className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-500 py-1.5 px-3 rounded-full transition-colors"
                                            >
                                                # {hint}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-300 text-[14.5px] leading-loose whitespace-pre-wrap font-light">
                                    {isChatLoading ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-3">
                                            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                            <span className="text-[12px] text-gray-600 font-medium">메모 데이터를 읽는 중...</span>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                            {chatResponse}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. Input Area: 더 일체감 있는 디자인 */}
                        <div className="p-4 bg-gray-900/50 border-t border-gray-800/50">
                            <div className="relative flex items-center">
                                <input 
                                    value={chatQuery}
                                    onChange={(e) => setChatQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && askAIAboutNotes()}
                                    placeholder="분석할 키워드나 질문 입력..."
                                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-2xl pl-5 pr-12 py-3.5 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-gray-600"
                                />
                                <button 
                                    onClick={askAIAboutNotes} 
                                    disabled={!chatQuery.trim() || isChatLoading}
                                    className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl transition-all active:scale-90"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI 실행 FAB 버튼 */}
                <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="fixed bottom-11 right-32 bg-gray-800 border border-gray-700 text-blue-400 p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 active:scale-95 group"
                >
                    <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;