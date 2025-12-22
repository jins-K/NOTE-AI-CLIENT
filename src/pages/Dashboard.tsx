import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/note.service';
import { type Note } from '../types/note';

// 시간 포맷 함수 (기존 동일)
const formatTime = (isoString: string | Date): string => {
    if (!isoString) return '날짜 정보 없음';
    return new Date(isoString).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
};

const Dashboard: React.FC = () => {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 💡 레이아웃 상태 추가
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const observeTargetRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const isFetching = useRef(false);

    // 데이터 페칭 로직 (기존 동일)
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
        if (!hasMore || isLoading) return; 
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchMoreNotes(); },
            { threshold: 0.5 }
        )
        if (observeTargetRef.current) observer.observe(observeTargetRef.current);
        return () => observer.disconnect();
    }, [fetchMoreNotes, isLoading, hasMore]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 relative">
            <div className="max-w-5xl mx-auto">
                
                {/* 헤더 섹션: 타이틀 + 레이아웃 토글 */}
                <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-8">
                    <h1 className="text-2xl font-bold text-gray-200 tracking-tight flex items-center">
                        <span className="w-1.5 h-7 bg-cyan-600 rounded-full mr-4 shadow-[0_0_15px_rgba(37,99,235,0.3)]"></span>
                        나의 메모 기록
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
                </header>

                <section>
                    {allNotes.length > 0 ? (
                        <div className={`${
                            viewMode === 'grid' 
                            ? 'columns-1 md:columns-2 gap-6 space-y-6' 
                            : 'flex flex-col space-y-5'
                        }`}> 
                            {allNotes.map((note: Note) => {
                                // 날짜와 시간을 분리하여 표시하기 위한 처리
                                const dateObj = new Date(note.updatedAt);
                                const dateStr = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                                const timeStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

                                return (
                                    <div 
                                        key={note.id} 
                                        onClick={() => navigate(`/note/${note.id}`)}
                                        className={`relative break-inside-avoid rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800/40 shadow-xl transition-all duration-300 cursor-pointer flex overflow-hidden
                                            ${viewMode === 'grid' 
                                                ? 'flex-col p-7 max-h-[400px]' 
                                                : 'flex-row items-start p-6 min-h-[110px] max-h-[400px]' 
                                            }`}
                                    >
                                        {/* 💡 날짜/시간 영역: 리스트 모드에서 두 줄 배치 */}
                                        <div className={`${
                                            viewMode === 'grid' 
                                            ? 'mb-4' 
                                            : 'flex-shrink-0 w-24 sm:w-28 border-r border-gray-700/50 mr-6 pt-1'
                                        }`}>
                                            <div className={`${viewMode === 'grid' ? 'flex items-center space-x-2' : 'flex flex-col space-y-1'}`}>
                                                {viewMode === 'grid' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60"></span>}
                                                
                                                {/* 날짜 */}
                                                <span className={`font-mono ${viewMode === 'grid' ? 'text-[11px] text-cyan-200 font-medium' : 'text-[13px] text-cyan-200 font-medium'} tracking-tighter`}>
                                                    {dateStr}
                                                </span>
                                                {/* 시간 (리스트 모드에서 강조) */}
                                                <span className={`font-mono text-cyan-200 tracking-tighter ${viewMode === 'grid' ? 'text-[11px] ml-1' : 'text-[13px] text-cyan-200 font-medium'}`}>
                                                    {timeStr}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 본문 영역 */}
                                        <div className="overflow-hidden flex-1">
                                            <p className={`text-gray-300 leading-relaxed font-normal whitespace-pre-wrap 
                                                ${viewMode === 'grid' 
                                                    ? 'text-[15px] line-clamp-[11]' 
                                                    : 'text-[15px] line-clamp-[12]' 
                                                }`}>
                                                {note.content}
                                            </p>
                                        </div>

                                        {/* 하단 페이드 효과 (400px 근처에서 잘릴 때 자연스럽게 처리) */}
                                        <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent rounded-b-2xl pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">아직 작성된 메모가 없습니다. 아래 버튼을 눌러 첫 메모를 작성해보세요!</p>
                        </div>
                    )}
                    <div ref={observeTargetRef} className="h-20 w-full mt-10" />
                </section>
            </div>

            {/* FAB */}
            <button onClick={() => navigate('/workspace')} className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
        </div>
    );
};

export default Dashboard;