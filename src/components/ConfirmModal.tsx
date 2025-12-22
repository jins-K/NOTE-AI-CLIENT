import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'primary';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    type = 'primary'
}) => {
    if (!isOpen) return null;

    const confirmButtonColor = type === 'danger' 
        ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' 
        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20';

    const iconColor = type === 'danger' ? 'text-red-500' : 'text-indigo-500';
    const iconBg = type === 'danger' ? 'bg-red-500/10' : 'bg-indigo-500/10';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                onClick={onClose} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-gray-800 border border-gray-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all animate-in zoom-in-95 duration-200">
                <div className={`flex items-center justify-center w-12 h-12 mx-auto ${iconBg} rounded-full mb-4`}>
                    {type === 'danger' ? (
                        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-center text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                    {description}
                </p>

                <div className="flex space-x-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 ${confirmButtonColor} text-white rounded-xl font-bold shadow-lg transition-all active:scale-95`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;