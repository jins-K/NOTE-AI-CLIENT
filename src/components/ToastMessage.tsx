// src/components/ToastMessage.tsx (Fade Out 애니메이션 추가)

import React, { useState, useEffect } from 'react';

type ToastVariant = 'error' | 'success' | 'warning' | 'info';

interface ToastMessageProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
  // 🚀 자동 닫힘 시간은 3초 (3000ms)로 고정합니다.
  duration?: number; 
}

// 💡 애니메이션 시간 (CSS transition 시간과 일치해야 함)
const FADE_OUT_DURATION = 300; // 0.3초

const ToastMessage: React.FC<ToastMessageProps> = ({ message, variant, onClose, duration = 1500 }) => {
  // 🚀 isVisible 상태 추가: 컴포넌트가 마운트되면 보이도록 설정
  const [isVisible, setIsVisible] = useState(true);

  if (!message) return null;

  // 1. 자동 닫힘 및 Fade Out 시작 로직
  useEffect(() => {
    // 💡 메시지가 렌더링되고 duration 시간 후 fade out 시작
    const autoCloseTimer = setTimeout(() => {
      handleFadeOut();
    }, duration);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(autoCloseTimer);
    };
  }, [duration]); 
  
  // 2. Fade Out 처리 로직
  const handleFadeOut = () => {
    // 1단계: isVisible을 false로 만들어 opacity를 0으로 만듭니다. (Fade Out 시작)
    setIsVisible(false);
    
    // 2단계: FADE_OUT_DURATION만큼 기다린 후, 메시지를 실제로 제거합니다.
    const removeTimer = setTimeout(() => {
      onClose(); // 부모 컴포넌트의 state(error)를 비웁니다.
    }, FADE_OUT_DURATION);

    // 클린업
    return () => clearTimeout(removeTimer);
  };
  
  // 3. 수동 닫기 버튼 클릭 시 Fade Out 시작
  const handleCloseClick = () => {
      handleFadeOut();
  };

  // 🎨 유형별 Tailwind CSS 클래스 매핑 (이전과 동일)
  const styles = {
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900',
      textColor: 'text-red-700 dark:text-red-300',
    },
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900',
      textColor: 'text-green-700 dark:text-green-300',
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      textColor: 'text-yellow-700 dark:text-yellow-300',
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
  };

  const currentStyle = styles[variant] || styles.info;

  return (
    <div 
      // 🚀 isVisible 상태에 따라 opacity를 변경하고 transition을 적용합니다.
      className={`fixed top-4 right-4 z-50 max-w-sm w-full 
                 rounded-lg shadow-2xl transition-opacity duration-${FADE_OUT_DURATION} 
                 ${isVisible ? 'opacity-100' : 'opacity-0'} 
                 ${currentStyle.bgColor} ${currentStyle.textColor}`}
      role="alert"
    >
      <div className="flex items-start p-4">
        
        {/* 메시지 텍스트 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium whitespace-pre-wrap">
            {message}
          </p>
        </div>
        
        {/* 닫기 버튼 */}
        <button
          onClick={handleCloseClick} // 💡 수동 닫기 시 handleFadeOut 호출
          className={`ml-4 p-1 rounded-md text-sm transition-colors 
                      ${currentStyle.textColor} opacity-70 hover:opacity-100 flex-shrink-0`}
          aria-label="Close"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastMessage;