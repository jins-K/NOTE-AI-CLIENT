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

    // === 데이터 로드 로직 (기존 유지) ===
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

    // === 🔑 [복구] 저장 및 등록 핸들러 ===
    const handleSaveNote = async (content: string) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                // 1. [수정] update 로직 (해당 API가 서비스에 있다고 가정)
                // 만약 서비스에 updateNote가 없다면 register 등을 상황에 맞게 변경하세요.
                await noteService.updateNote(id!, content); 
                alert('메모가 수정되었습니다.');
                navigate(`/note/${id}`, { replace: true });
            } else {
                // 2. [등록] 기존에 사용하시던 register 로직 복구
                await noteService.register(content.trim());
                alert('새로운 메모가 기록되었습니다.');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-indigo-400 font-medium animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    기록을 불러오는 중...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* 1. 상단 바: 미니멀한 타이틀과 돌아가기 버튼 */}
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

                {/* 2. 메인 에디터 영역 */}
                <section className="transition-all duration-500">
                    <NoteCreator 
                        onCreateNote={handleSaveNote} 
                        isSubmitting={isSubmitting}
                        initialValue={initialContent} 
                    />
                </section>

                {/* 3. 하단 팁 (수정 모드 시) */}
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