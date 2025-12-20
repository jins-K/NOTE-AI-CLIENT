// /src/components/NoteCreator.tsx

import React, { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import { noteService } from '../services/note.service';
import { useNavigate } from 'react-router-dom';
interface NoteCreatorProps {
    onCreateNote: (noteContent: string) => Promise<void>;
    isSubmitting: boolean; 
}

// 🔑 [핵심 변수] 줄 간격 및 라인 높이를 28px (1.75rem)로 조정
const LINE_HEIGHT_PX = 28; 
const LINE_HEIGHT_REM = `${LINE_HEIGHT_PX / 16}rem`; // 1.75rem
const PADDING_TOP_PX = 12; // ⬅️ 이 값이 패딩 크기입니다.

const NoteCreator: React.FC<NoteCreatorProps> = ({ onCreateNote, isSubmitting }) => {
    const [newNote, setNewNote] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null); 
    const nav = useNavigate();
    // === Textarea 높이 자동 조절 로직 (유지) ===
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
        handleResizeHeight();
    }, [handleResizeHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNote(e.target.value);
        handleResizeHeight();
    };
    
    const handleSubmit = async () => {
        if (newNote.trim()) {
            const res = await noteService.register(newNote.trim());
            setNewNote('');
            setTimeout(handleResizeHeight, 0);
            nav("/dashboard");
        }
    };

    const noteStyle = {
        padding: `${PADDING_TOP_PX}px`,
        minHeight: '150px',
        overflowY: 'hidden',
        lineHeight: LINE_HEIGHT_REM,
        
        backgroundColor: '#242d38', 
        color: '#f9fafb', 

        // 줄 스타일 유지
        backgroundImage: `linear-gradient(to bottom, #4b5563 1px, transparent 1px)`,
        backgroundSize: `100% ${LINE_HEIGHT_REM}`, 
        backgroundAttachment: 'local',
        backgroundPosition: `0 ${PADDING_TOP_PX}px`, // 가로(X축) 0, 세로(Y축) 12px 이동
        fontSize: '1rem', 
    };


    return (
        <section className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                ✍️ 새로운 아이디어 메모
                {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 ml-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
            </h2>
            <textarea
                ref={textareaRef}
                // 💡 [수정] border 클래스 제거 및 shadow-lg 클래스 추가
                className="w-full text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none shadow-lg" 
                rows={1}
                style={noteStyle as CSSProperties} 
                placeholder="오늘의 아이디어를 자유롭게 메모하세요. AI가 핵심 통찰을 정리해 드립니다."
                value={newNote}
                onChange={handleChange} 
                disabled={isSubmitting}
            />
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={!newNote.trim() || isSubmitting}
                    className={`py-2 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                        newNote.trim() && !isSubmitting
                            ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/50 active:scale-[0.99]'
                            : 'bg-gray-600 cursor-not-allowed'
                    }`}
                >
                    {isSubmitting ? 'AI가 통찰 중...' : 'AI 메모 생성 및 저장'}
                </button>
            </div>
        </section>
    );
};

export default NoteCreator;