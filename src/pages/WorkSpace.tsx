import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { noteService } from '../services/note.service';
import NoteCreator from '../components/NoteCreator';

const WorkSpace: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const isEditMode = !!id;
    
    const [initialContent, setInitialContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);

    // === 데이터 로드 로직 ===
    useEffect(() => {
        const fetchNote = async () => {
            if (!isEditMode) return;
            
            if (location.state?.initialData) {
                setInitialContent(location.state.initialData.content);
                setIsLoading(false);
                return;
            }

            try {
                const data = await noteService.getNote(id!);
                setInitialContent(data.content);
            } catch (error) {
                console.error('불러오기 실패:', error);
                alert('메모를 불러오는데 실패했습니다.');
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNote();
    }, [id, isEditMode, navigate, location.state]);

    // === 저장 및 등록 핸들러 ===
    const handleSaveNote = async (content: string) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await noteService.updateNote(id!, content); 
                alert('메모가 수정되었습니다.');
                navigate(`/note/${id}`, { replace: true });
            } else {
                const newNote = await noteService.register(content.trim());
                alert('새로운 메모가 기록되었습니다.');
                navigate(`/note/${newNote.id}`, { replace: true });
            }
        } catch (error) {
            console.error('저장 실패:', error);
            // 💡 [핵심] 이제 에디터의 상태가 격리되어 있으므로, 단순히 알림만 띄워도 입력값이 날아가지 않습니다.
            alert('저장 중 오류가 발생했습니다. 작성 중이던 내용은 그대로 유지됩니다.');
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
                <span className="ml-3 text-lg">기록을 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans">
            {/* AI 분석 로딩 오버레이 */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.415 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">AI 분석 중</h2>
                        <p className="text-gray-400 text-center leading-relaxed">
                            메모의 핵심 내용을 파악하여<br/>
                            <span className="text-blue-400 font-semibold">제목, 요약, 태그</span>를 생성하고 있습니다.
                        </p>
                    </div>
                </div>
            )}
            
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className={`w-1 h-6 rounded-full ${isEditMode ? 'bg-indigo-500' : 'bg-blue-500'}`} />
                        <h1 className="text-xl font-bold tracking-tight text-gray-200">
                            {isEditMode ? '📝 기록 편집' : '✍️ 새로운 기록'}
                        </h1>
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-xl transition-all border border-gray-800"
                    >
                        <span className="font-medium text-xs">돌아가기</span>
                    </button>
                </header>

                <section className="transition-all duration-500">
                    {/* 💡 [수정] key 속성을 부여하여 렌더링 생명주기를 완벽히 분리합니다 */}
                    <NoteCreator 
                        onCreateNote={handleSaveNote} 
                        isSubmitting={isSubmitting}
                        initialValue={initialContent} 
                    />
                </section>

                {isEditMode && (
                    <p className="mt-6 text-center text-xs text-gray-600 font-medium tracking-wide">
                        수정된 내용은 기존 기록에 바로 덮어씌워집니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WorkSpace;