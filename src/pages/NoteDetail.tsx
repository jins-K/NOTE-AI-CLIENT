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
            setNote(data);
        } catch (error) {
            console.error('불러오기 실패:', error);
            alert('메모를 찾을 수 없습니다.');
            navigate('/');
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
            navigate('/', { replace: true });
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-indigo-400 font-medium animate-pulse">데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans leading-relaxed">
            <div className="max-w-5xl mx-auto">
                
                {/* 1. 상단 바 (목록으로) */}
                <div className="flex justify-start items-center mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-xl transition-all active:scale-95 border border-gray-800 hover:border-gray-700"
                    >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium text-sm">목록으로</span>
                    </button>
                </div>

                {/* 2. 메인 컨텐츠 카드 */}
                <article className="relative bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden mb-12">
                    
                    {/* ✏️ 우측 상단 수정 아이콘 버튼 */}
                    <button
                        onClick={() => navigate(`/workspace/${note.id}`)}
                        className="absolute top-6 right-6 z-10 p-3 bg-gray-900/50 hover:bg-indigo-600 text-gray-400 hover:text-white border border-gray-700 hover:border-indigo-500 rounded-2xl transition-all duration-300 group shadow-lg active:scale-90"
                        title="기록 수정"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    <header className="p-8 border-b border-gray-700 bg-gray-800/50">
                        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span>Memory Detail View</span>
                        </div>
                        {/* 제목 (수정 버튼과 겹치지 않게 우측 패딩 확보) */}
                        <h1 className="text-3xl font-bold text-white leading-snug pr-14">
                            {note.content.substring(0, 50)}...
                        </h1>
                        <div className="mt-4 flex items-center text-gray-500 text-sm font-mono">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(note.updatedAt || '').toLocaleString('ko-KR')}
                        </div>
                    </header>

                    <div className="p-8">
                        <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-700/30">
                            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-light">
                                {note.content}
                            </p>
                        </div>
                    </div>
                </article>

                {/* 3. 하단 위험 구역 (지우기) */}
                <div className="flex justify-center border-t border-gray-800 pt-8">
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="group flex items-center px-6 py-2.5 bg-red-500/5 border border-red-500/20 text-red-500/80 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl transition-all duration-300 active:scale-95"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-bold tracking-tight">지우기</span>
                    </button>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="메모 삭제"
                description={`이 메모를 삭제하시겠습니까?\n삭제된 내용은 다시 복구할 수 없습니다.`}
                confirmText="네, 삭제합니다"
                cancelText="아니요, 유지할게요"
                type="danger"
            />
        </div>
    );
};

export default NoteDetail;