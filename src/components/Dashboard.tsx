// // /src/pages/Dashboard.tsx (메모 기록 조회 및 관리 화면)

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useFeedback , type Feedback } from '../hooks/useFeedback'; // 메모 목록을 가져오는 훅


// const Dashboard: React.FC = () => {
//     // 💡 [가정] useFeedback 훅이 무한 스크롤을 위해 페이지네이션 데이터를 반환한다고 가정합니다.
//     // 현재는 단순 배열로 처리하고, 무한 스크롤 구현부를 주석으로 표시합니다.
//     const { data: feedbacks, isLoading, error } = useFeedback();
    
//     // 무한 스크롤 구현을 위한 Intersection Observer Ref (주석으로 로직만 표시)
//     const observerTargetRef = useRef<HTMLDivElement>(null);
    
//     // // 💡 [무한 스크롤 로직 삽입 위치]
//     // useEffect(() => {
//     //     if (isLoading || !hasNextPage) return; // 로딩 중이거나 다음 페이지가 없으면 리턴

//     //     const observer = new IntersectionObserver(
//     //         (entries) => {
//     //             // 관찰 대상(observerTargetRef)이 뷰포트에 들어왔을 때 다음 페이지를 로드
//     //             if (entries[0].isIntersecting) {
//     //                 fetchNextPage();
//     //             }
//     //         },
//     //         { threshold: 1.0 } // 뷰포트의 100%가 보일 때 트리거
//     //     );

//     //     if (observerTargetRef.current) {
//     //         observer.observe(observerTargetRef.current);
//     //     }

//     //     return () => {
//     //         if (observerTargetRef.current) {
//     //             observer.unobserve(observerTargetRef.current);
//     //         }
//     //     };
//     // }, [isLoading, hasNextPage, fetchNextPage]);


//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//                 {/* 로딩 스피너 */}
//                 <span className="ml-3 text-lg">메모 기록을 불러오는 중...</span>
//             </div>
//         );
//     }
    
//     if (error) {
//          return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
//                 <p>메모를 불러오는 중 오류가 발생했습니다: {error.message}</p>
//             </div>
//         );
//     }

//     const allNotes = feedbacks || []; // 데이터를 배열로 가정

//     return (
//         <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
//             <div className="max-w-5xl mx-auto">
                
//                 {/* === 1. 대시보드 헤더 === */}
//                 <header className="mb-8 border-b border-gray-700 pb-4">
//                     <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center">
//                         <svg className="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
//                         나의 메모 기록
//                     </h1>
//                     <p className="mt-1 text-xl text-gray-400">모든 아이디어와 AI 통찰을 한눈에 확인하세요.</p>
//                 </header>

//                 {/* === 2. 메모 목록 (Grid/Column Layout) === */}
//                 <section>
                    
//                     {allNotes.length > 0 ? (
//                         // 메모 카드 레이아웃: 넓은 화면에서 2단으로 배열
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
//                             {allNotes.map((note: Feedback) => {
//                                 // 💡 [AI 반영 여부 체크] answer 필드에 내용이 있으면 AI 반영된 것으로 간주
//                                 const isAiEnhanced = note.answer && note.answer.trim().length > 0;
                                
//                                 return (
//                                     <div 
//                                         key={note.id} 
//                                         // 💡 AI 반영된 메모는 파란색 테두리와 강조된 배경으로 표시
//                                         className={`p-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01] ${
//                                             isAiEnhanced
//                                                 ? 'bg-gray-800 border-2 border-blue-500/80' // AI 반영됨
//                                                 : 'bg-gray-800 border border-gray-700 hover:border-gray-500' // AI 미반영 또는 원본만 저장됨
//                                         }`}
//                                     >
                                        
//                                         {/* 💡 [별도 표시] AI 반영 뱃지 */}
//                                         <div className="flex justify-between items-start mb-3 border-b border-gray-700 pb-3">
//                                             <p className="text-sm text-gray-400">
//                                                 메모 ID: <span className="font-mono text-gray-500">{note.id}</span>
//                                             </p>
//                                             {isAiEnhanced && (
//                                                 <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-600 text-white shadow-lg">
//                                                     ✨ AI 통찰 완료
//                                                 </span>
//                                             )}
//                                         </div>

//                                         {/* 원본 메모 (Question) */}
//                                         <div className="mb-4">
//                                             <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider">
//                                                 원본 아이디어 (Q)
//                                             </h3>
//                                             <p className="mt-1 text-lg text-gray-200 whitespace-pre-wrap line-clamp-3">
//                                                 {note.question}
//                                             </p>
//                                         </div>
                                        
//                                         {/* AI 생성 메모 (Answer) - AI 반영된 경우에만 표시 */}
//                                         {isAiEnhanced && (
//                                             <div>
//                                                 <h3 className="text-base font-semibold text-blue-400 uppercase tracking-wider flex items-center mt-2">
//                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 12H8V8h2v6zm4-7H8v2h4V7z"></path></svg>
//                                                     AI 통찰 요약 (A)
//                                                 </h3>
//                                                 <p className="mt-1 text-xl font-bold text-white whitespace-pre-wrap line-clamp-3">
//                                                     {note.answer}
//                                                 </p>
//                                             </div>
//                                         )}
                                        
//                                         {/* 전체 메모 보기 버튼 (실제 라우팅 연결 필요) */}
//                                         <div className="mt-4 pt-4 border-t border-gray-700/50">
//                                              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
//                                                 전체 메모 보기 &rarr;
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
                            
//                             {/* 💡 [무한 스크롤 관찰 대상] - 실제 구현 시 사용 */}
//                             {/* <div ref={observerTargetRef} className="col-span-full py-4 text-center">
//                                 {isFetchingNextPage && <p className="text-blue-400">더 많은 메모 로딩 중...</p>}
//                                 {!hasNextPage && allNotes.length > 0 && <p className="text-gray-500">모든 메모를 확인했습니다.</p>}
//                             </div> */}
//                         </div>
//                     ) : (
//                         // 메모가 없을 경우
//                         <div className="p-12 text-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl">
//                             <p className="text-xl text-gray-400">아직 저장된 AI 메모가 없습니다.</p>
//                             <p className="text-lg text-gray-500 mt-2">메모 등록 화면으로 이동하여 새로운 아이디어를 기록해 보세요!</p>
//                         </div>
//                     )}
//                 </section>

//             </div>
//         </div>
//     );
// };

// export default Dashboard;