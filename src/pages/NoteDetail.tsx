import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { noteService } from '../services/note.service';
import { type Note } from '../types/note';
import ConfirmModal from '../components/ConfirmModal';

const NoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [note, setNote] = useState<Note | null>(location.state?.initialData || null);
    const [isLoading, setIsLoading] = useState(!note);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchNoteDetail = useCallback(async () => {
        if (!id) return;
        try {
            const data = await noteService.getNote(id);
            if (data != null && Object.keys(data).length > 0) {
                setNote(data);
            }
            
        } catch (error) {
            console.error('불러오기 실패:', error);
            alert('메모를 찾을 수 없습니다.');
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchNoteDetail();
    }, [fetchNoteDetail]);

    const handleDeleteConfirm = async () => {
        if (!id) return;
        try {
            await noteService.deleteNote(id); 
            alert('성공적으로 삭제되었습니다.');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-cyan-400 font-medium animate-pulse">AI 분석 데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (!note) return null;

    // 💡 태그 배열 안전하게 처리
    const tagsArray = Array.isArray(note.tags) ? note.tags : [];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans leading-relaxed">
            <div className="max-w-4xl mx-auto">
                
                {/* 1. 상단 바 */}
                <div className="flex justify-start items-center mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-xl transition-all active:scale-95 border border-gray-800"
                    >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium text-sm">목록으로</span>
                    </button>
                </div>

                {/* 2. 메인 컨텐츠 카드 */}
                <article className="relative bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
                    
                    <button
                        onClick={() => navigate(`/workspace/${note.id}`)}
                        className="absolute top-6 right-6 z-10 p-3 bg-gray-900/50 hover:bg-blue-600 text-gray-400 hover:text-white border border-gray-700 hover:border-blue-500 rounded-2xl transition-all duration-300 group shadow-lg active:scale-90"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    <header className="p-8 border-b border-gray-700 bg-gray-800/30">
                        {/* 태그 영역 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tagsArray.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 font-semibold tracking-wide">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* 💡 AI 생성 제목 */}
                        <h1 className="text-3xl font-bold text-white leading-tight pr-14 mb-4">
                            {note.title || '제목을 분석하고 있습니다...'}
                        </h1>

                        <div className="flex items-center text-gray-500 text-xs font-mono">
                            <svg className="w-4 h-4 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            최종 업데이트: {new Date(note.updatedAt || '').toLocaleString('ko-KR')}
                        </div>
                    </header>

                    <div className="p-8 space-y-8">
                        {/* 💡 AI 요약 섹션 (강조) */}
                        {note.summary && (
                            <section className="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    AI Insight Summary
                                </h3>
                                <p className="text-gray-300 text-lg font-medium leading-relaxed">
                                    "{note.summary}"
                                </p>
                            </section>
                        )}
                        {/* 본문 영역 */}
                        <section>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Full Content</h3>
                            <div className="bg-gray-950/30 rounded-2xl p-8 border border-gray-700/30 min-h-[200px]">
                                <p className="text-gray-300 text-[16px] leading-loose whitespace-pre-wrap font-normal">
                                    {note.content}
                                </p>
                            </div>
                        </section>
                        {/* 💡 [신규 추가] AI 제안(Suggestions) 섹션 */}
                        {note.suggestion && (
                            <section className="mt-8 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl overflow-hidden shadow-sm">
                                {/* 상단바: 색상을 옐로우 톤으로 변경 */}
                                <div className="bg-yellow-500/10 px-6 py-3.5 border-b border-yellow-500/10 flex items-center">
                                    <h3 className="text-yellow-500/80 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center">
                                        <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        AI Smart Recommendations
                                    </h3>
                                </div>
                                
                                <div className="p-7 sm:p-9">
                                    <div className="flex flex-col gap-7">
                                        {note.suggestion.split(/(?=\d+\.)/).map((item, i) => {
                                            const trimmedItem = item.trim();
                                            if (!trimmedItem) return null;

                                            return (
                                                <div key={i} className="flex gap-4 group items-start">
                                                    {/* 💡 숫자 디자인: 크기를 줄이고 상단 높이(pt-1)를 맞춰 텍스트와 정렬 */}
                                                    <div className="flex-shrink-0 pt-0.5">
                                                        <div className="relative flex items-center justify-center w-6 h-6">
                                                            {/* 더 밝고 화사한 노란색 배경 */}
                                                            <div className="absolute inset-0 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/20 transition-all duration-300"></div>
                                                            <span className="relative z-10 text-yellow-500 font-bold text-sm font-mono">
                                                                {i + 1}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <p className="text-gray-300 text-[15.5px] leading-relaxed">
                                                            {/* 텍스트 파싱 로직 */}
                                                            {trimmedItem.replace(/^\d+\.\s*/, '').split(/(\*\*.*?\*\*)/).map((part, idx) => (
                                                                part.startsWith('**') && part.endsWith('**') 
                                                                    ? <strong key={idx} className="text-yellow-100 font-bold border-b border-yellow-500/20 pb-0.5">{part.slice(2, -2)}</strong>
                                                                    : part
                                                            ))}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </article>

                {/* 3. 삭제 구역 */}
                <div className="flex justify-center pt-4">
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="group flex items-center px-5 py-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-xs font-bold">기록 삭제하기</span>
                    </button>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="메모 삭제"
                description={`이 메모를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없으며 AI가 분석한 데이터도 모두 삭제됩니다.`}
                confirmText="삭제하기"
                cancelText="취소"
                type="danger"
            />
        </div>
    );
};

export default NoteDetail;