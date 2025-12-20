// /src/pages/WorkSpace.tsx (개선된 버전)

import React, { useState } from 'react';
import { useFeedback } from '../hooks/useFeedback';
// 💡 분리된 NoteCreator 컴포넌트 import
import NoteCreator from '../components/NoteCreator'; 

// 💡 [가정] 메모 생성 API 호출을 담당하는 서비스 함수 (실제 구현 필요)
const createNoteService = async (content: string) => {
    // 실제로는 /api/notes 엔드포인트에 content를 POST 요청하는 로직이 들어갑니다.
    // 임시로 1.5초 지연을 시뮬레이션합니다.
    
    return new Promise<void>(resolve => setTimeout(resolve, 1500));
};


const WorkSpace: React.FC = () => {
    // useFeedback 훅이 데이터를 가져올 때마다 새로운 배열을 반환한다고 가정합니다.
    const { data: feedbacks, isLoading, refetch } = useFeedback(); 
    const [isSubmitting, setIsSubmitting] = useState(false); // 메모 제출 중 상태

    // === 메모 생성 핸들러 ===
    const handleCreateNote = async (noteContent: string) => {
        setIsSubmitting(true);
        try {
            // 1. 메모 생성 API 호출
            await createNoteService(noteContent);
            
            // 2. 성공 후 목록 갱신
            refetch(); 
            
            // 3. 사용자 피드백 (성공 메시지 등)
            alert('새로운 메모가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('메모 생성 실패:', error);
            alert('메모 생성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-lg">AI 메모를 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                
                {/* === 1. 헤더 영역 === */}
                <header className="mb-8 border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
                        AI Note Dashboard
                    </h1>
                    <p className="mt-1 text-xl text-gray-400">새로운 아이디어를 메모하고 AI의 통찰을 얻으세요.</p>
                </header>

                {/* === 2. 메모 생성 컴포넌트 통합 === */}
                <NoteCreator 
                    onCreateNote={handleCreateNote} 
                    isSubmitting={isSubmitting} 
                />

                {/* === 3. 메모 목록 영역 === */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-2">📚 최근 메모 기록</h2>
                    
                    <div className="space-y-6">
                        {feedbacks && feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <div 
                                    key={feedback.id} 
                                    className="p-5 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-400 transition-all duration-300 shadow-lg"
                                >
                                    {/* 원본 메모 (Question) */}
                                    <div className="mb-3 pb-3 border-b border-gray-700">
                                        <p className="text-sm text-gray-400 font-medium">원본 메모 (Q)</p>
                                        <p className="mt-1 text-lg font-light text-gray-200 whitespace-pre-wrap">{feedback.question}</p>
                                    </div>
                                    
                                    {/* AI 생성 메모 (Answer) */}
                                    <div>
                                        <p className="text-sm text-blue-400 font-medium flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.276a6 6 0 00-7.962-1.921A6 6 0 004 12a6 6 0 001.956 4.296A6 6 0 0012 20h4a2 2 0 002-2V6a2 2 0 00-2-2h-4a6 6 0 00-1.921 7.962"></path></svg>
                                            AI 통찰 (A)
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-white whitespace-pre-wrap">{feedback.answer}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // 메모가 없을 경우
                            <div className="p-8 text-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl">
                                <p className="text-lg text-gray-400">아직 저장된 메모가 없습니다.</p>
                                <p className="text-base text-gray-500 mt-2">위의 입력창에 메모를 남겨 첫 통찰을 얻어보세요!</p>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default WorkSpace;