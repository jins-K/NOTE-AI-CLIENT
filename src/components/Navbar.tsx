import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4 shadow-2xl shadow-black/70">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* 로고 */}
        <Link 
          to="/" 
          className="text-xl font-light text-blue-400 tracking-widest uppercase hover:text-blue-300 transition-colors duration-200"
        >
          AI Note
        </Link>
        
        <div className="flex gap-6 items-center ">
          
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="text-sm text-sky-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
          )}
          
          {isAuthenticated ? (
            /* ✅ 주위 배경색과 비슷하게 맞춘 로그아웃 버튼 */
            <button
              onClick={logout}
              title="로그아웃"
              /* - bg-gray-800/40: 주위 gray-900과 거의 흡사하지만 미세하게 밝음
                 - border border-gray-700/50: 버튼의 윤곽만 살짝 잡아줌
              */
              className="group p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-800/80 transition-all duration-300 active:scale-95"
            >
              <svg 
                /* 평소에도 보라색 톤을 유지하되, 약간 투명하게 조절 */
                className="w-5 h-5 text-sky-500/80 group-hover:text-purple-400 transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.8" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
          ) : (
            <Link 
              to="/login" 
              className="text-sm py-1.5 px-4 bg-blue-600/70 text-white rounded-md font-medium hover:bg-blue-500 transition-colors duration-200 shadow-md"
            >
              로그인
            </Link>
          )}
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;