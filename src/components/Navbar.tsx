import React from 'react';
import { Link } from 'react-router-dom';
// 💡 [가정] 인증 상태를 관리하는 커스텀 훅을 import 합니다.
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  // 💡 [추가] useAuth 훅을 사용하여 로그인 상태와 로그아웃 함수를 가져옵니다.
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4 shadow-2xl shadow-black/70 transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* 로고 */}
        <Link 
          to="/" 
          className="text-xl font-light text-blue-400 tracking-widest uppercase hover:text-blue-300 transition-colors duration-200"
        >
          AI Note
        </Link>
        
        <div className="flex gap-4 items-center">
          
          {/* 💡 [조건부 렌더링] 로그인 상태일 때만 Dashboard 링크 표시 */}
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
          )}
          
          {/* 💡 [조건부 렌더링] 인증 상태에 따라 버튼 전환 */}
          {isAuthenticated ? (
            // ✅ 로그인된 상태: 로그아웃 버튼 표시
            <button
              onClick={logout}
              // 버튼으로 변경하고, 로그아웃 버튼은 경고 색상(red)을 사용합니다.
              className="text-sm py-1.5 px-4 bg-red-600/70 text-white rounded-md font-medium hover:bg-red-500 transition-colors duration-200 shadow-md active:scale-[0.98]"
            >
              로그아웃
            </button>
          ) : (
            // ✅ 로그아웃된 상태: 로그인 링크 표시
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