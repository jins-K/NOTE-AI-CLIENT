import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/note.service';
import { type Note } from '../types/note';
// import { useFeedback, type Feedback } from '../hooks/useFeedback'; // 메모 목록을 가져오는 훅

// 💡 시간 포맷팅을 위한 헬퍼 함수 (최신 수정 시간을 사용자가 보기 좋게 변환)
const formatTime = (isoString: string | Date): string => {
    if (!isoString) return '날짜 정보 없음';
    // ISO String을 Date 객체로 변환하여 로컬 시간으로 포맷팅
    return new Date(isoString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Dashboard: React.FC = () => {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const observeTargetRef = useRef<HTMLDivElement>(null); // 바닥 감지용
    const navigate = useNavigate();

    // isLoading 은 상태값 , isFetching은 참조
    const isFetching = useRef(false); // 실행 여부를 기억 (렌더링을 유발하지 않음)
    // 3. 데이터 로드 함수
    const fetchMoreNotes = useCallback(async() => {
        if ( isLoading || isFetching.current || (allNotes.length > 0 && !hasMore)) return;
        isFetching.current = true;
        setIsLoading(true);
        try { 
            const response = await noteService.getNotes(page, 10);
            const {notes, pagination } = response;
            setAllNotes(prev => [...prev, ...notes]);

            if (page >= pagination.totalPages) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('메모 목록 불러오기 실패:', error);
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, [page, isLoading, hasMore]);


    useEffect(() => {
        fetchMoreNotes();

    }, []); // 최초 로딩시 조회
    
    useEffect(() => {
        if (!hasMore || isLoading) return; 
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    fetchMoreNotes();
                }
            },
            { threshold: 0.5 }
        )
        if (observeTargetRef.current) {
            observer.observe(observeTargetRef.current);
        }
        return () => observer.disconnect();
    }, [fetchMoreNotes, isLoading, hasMore])


    const handleCreateMemo = useCallback(() => {
        navigate('/workspace'); 
    }, [navigate]);

    const handleViewDetail = useCallback((id: string) => {
        navigate(`/feedback/${id}`); 
    }, [navigate]);
    
    const handleEditMemo = useCallback((id: string) => {
        navigate(`/workspace/${id}`); 
    }, [navigate]);


    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <span className="ml-3 text-lg">메모 기록을 불러오는 중...</span>
            </div>
        );
    }
    
    // if (error) {
    //      return (
    //         <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
    //             <p>메모를 불러오는 중 오류가 발생했습니다: {error.message}</p>
    //         </div>
    //     );
    // }

    // const allNotes = feedbacks || [];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 relative">
            <div className="max-w-5xl mx-auto">
                
                {/* === 1. 대시보드 헤더 === */}
                <header className="mb-8 border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center">
                        <svg className="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        나의 메모 기록
                    </h1>
                    <p className="mt-1 text-xl text-gray-400">모든 아이디어와 AI 통찰을 한눈에 확인하세요.</p>
                </header>

                {/* === 2. 메모 목록 (Grid/Column Layout) === */}
                <section>
                    
                    {allNotes.length > 0 ? (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                            {allNotes.map((note: Note) => {
                                // 💡 [수정] 메모 내용 결정: AI 응답이 있으면 AI 응답을 우선 표시
                                const displayMemo = note.content && note.content.trim().length > 0 ? note.content : note.content;
                                
                                // 💡 [추가] 메모 내용을 기반으로 제목 추출 (최대 30자)
                                const title = displayMemo.substring(0, 30) + (displayMemo.length > 30 ? '...' : '');
                                
                                // 💡 [가정] Feedback 타입에 updated_at이 string | Date 타입으로 있다고 가정
                                const lastUpdated = note.updatedAt ? formatTime(note.updatedAt) : '정보 없음';

                                return (
                                    <div 
                                        key={note.id} 
                                        className={`p-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01] bg-gray-800 border-2 border-gray-700 hover:border-blue-500/80 cursor-pointer`}
                                        onClick={() => handleViewDetail(note.id)} // 💡 카드 클릭 시 상세 보기로 이동
                                    >
                                        
                                        {/* 1. 🔑 [수정] 제목 및 수정 시간 영역 */}
                                        <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-3">
                                            <h2 className="text-2xl font-bold text-white truncate w-3/4">
                                                {title}
                                            </h2>
                                            <p className="text-xs text-gray-500 font-mono flex-shrink-0">
                                                {lastUpdated}
                                            </p>
                                        </div>

                                        {/* 2. 🔑 [수정] 메모 본문 (Line Clamp 3 유지) */}
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                                                {note.content && note.content.trim().length > 0 ? "AI 통찰" : "원본 메모"}
                                            </h3>
                                            
                                            <p className="mt-1 whitespace-pre-wrap line-clamp-3 text-lg text-gray-200">
                                                {displayMemo}
                                            </p>
                                        </div>
                                        
                                        {/* 3. 🔑 [수정] 버튼 영역 (수정 버튼만 남기고 상세 보기 기능은 카드 클릭에 할당) */}
                                        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-end">
                                            
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 💡 카드 클릭 이벤트가 전파되는 것을 막음
                                                    handleEditMemo(note.id);
                                                }} 
                                                className="text-sm text-gray-400 hover:text-yellow-400 font-medium flex items-center" 
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                수정하기
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    
                        <div 
                            ref={observeTargetRef} 
                            className="h-20 w-full flex items-center justify-center mt-10"
                        >
                            {isLoading && (
                                <div className="flex items-center space-x-2 text-blue-400">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    <span className="text-sm font-medium">추가 메모를 불러오는 중...</span>
                                </div>
                            )}
                            {!hasMore && allNotes.length > 0 && (
                                <p className="text-gray-500 text-sm italic">모든 메모를 다 읽었습니다. ✨</p>
                            )}
                        </div>
                        </>
                    ) : (
                        // 메모가 없을 경우
                        <div className="p-12 text-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl">
                            <p className="text-xl text-gray-400">아직 저장된 메모가 없습니다.</p>
                            <p className="text-lg text-gray-500 mt-2 mb-6">메모 등록 화면으로 이동하여 새로운 아이디어를 기록해 보세요!</p>
                            <button 
                                onClick={handleCreateMemo}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
                            >
                                + 새 아이디어 기록 시작하기
                            </button>
                        </div>
                    )}
                </section>

            </div>

            {/* 🔑 플로팅 액션 버튼 (FAB) - 새 메모 생성용 */}
            <button
                onClick={handleCreateMemo}
                className="fixed bottom-8 right-8 
                           bg-blue-600 hover:bg-blue-700 
                           text-white font-bold 
                           p-4 rounded-full shadow-2xl 
                           transition duration-150 ease-in-out 
                           flex items-center space-x-2 z-50 
                           focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                aria-label="새 메모 등록"
                title="새 메모 등록"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </button>
        </div>
    );
};

export default Dashboard;

// JSX expression must have one parent element.