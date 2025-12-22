import React, { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';

interface NoteCreatorProps {
    onCreateNote: (noteContent: string) => Promise<void>;
    isSubmitting: boolean;
    initialValue?: string;
}

const LINE_HEIGHT_PX = 28; 
const LINE_HEIGHT_REM = `${LINE_HEIGHT_PX / 16}rem`; 
const PADDING_TOP_PX = 12;

const NoteCreator: React.FC<NoteCreatorProps> = ({ onCreateNote, isSubmitting, initialValue = '' }) => {
    const [newNote, setNewNote] = useState(initialValue);
    const textareaRef = useRef<HTMLTextAreaElement>(null); 
    const isEditMode = initialValue.length > 0;

    const handleResizeHeight = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; 
            const currentScrollHeight = textareaRef.current.scrollHeight;
            const minHeight = 150; 
            const requiredHeight = Math.ceil(currentScrollHeight / LINE_HEIGHT_PX) * LINE_HEIGHT_PX;
            textareaRef.current.style.height = `${Math.max(requiredHeight, minHeight)}px`;
        }
    }, []);

    useEffect(() => {
        setNewNote(initialValue);
        setTimeout(handleResizeHeight, 0);
    }, [initialValue, handleResizeHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNote(e.target.value);
        handleResizeHeight();
    };
    
    const handleSubmit = async () => {
        if (newNote.trim()) {
            await onCreateNote(newNote.trim());
            if (!isEditMode) {
                setNewNote('');
                setTimeout(handleResizeHeight, 0);
            }
        }
    };

    const noteStyle = {
        padding: `${PADDING_TOP_PX}px`,
        minHeight: '150px',
        overflowY: 'hidden',
        lineHeight: LINE_HEIGHT_REM,
        backgroundColor: '#242d38', 
        color: '#f9fafb', 
        backgroundImage: `linear-gradient(to bottom, #4b5563 1px, transparent 1px)`,
        backgroundSize: `100% ${LINE_HEIGHT_REM}`, 
        backgroundAttachment: 'local',
        backgroundPosition: `0 ${PADDING_TOP_PX}px`,
        fontSize: '1rem', 
    };

    return (
        <section className="bg-gray-800/50 p-8 rounded-[32px] shadow-2xl mb-10 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden">
            
            {/* 💡 중복된 제목 대신 들어가는 아주 작은 모드 배지 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isEditMode ? 'bg-indigo-500' : 'bg-blue-500'} animate-pulse`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        {isEditMode ? 'Edit Mode' : 'New Thought'}
                    </span>
                </div>
                
                {isSubmitting && (
                    <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider animate-pulse">
                        <svg className="animate-spin h-3 w-3 mr-2 text-indigo-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                    </div>
                )}
            </div>
            
            <textarea
                ref={textareaRef}
                className={`w-full text-lg rounded-2xl transition-all duration-300 resize-none bg-transparent border-none focus:ring-0 p-0
                    ${isEditMode ? 'text-indigo-50' : 'text-gray-100'}`} 
                rows={1}
                style={noteStyle as CSSProperties} 
                placeholder={isEditMode ? "" : "오늘 어떤 생각을 하셨나요?"}
                value={newNote}
                onChange={handleChange} 
                disabled={isSubmitting}
                autoFocus={isEditMode}
            />
            
            <div className="flex justify-end mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={!newNote.trim() || isSubmitting}
                    className={`group flex items-center py-2 px-4 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg
                        ${!newNote.trim() || isSubmitting 
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
                            : isEditMode 
                                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' 
                                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                        }`}
                >
                    <span>{isEditMode ? '수정 완료' : '기록하기'}</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default NoteCreator;