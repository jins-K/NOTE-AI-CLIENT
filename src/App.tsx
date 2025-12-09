// /src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Dashboard 대신 WorkSpace (메모 기록)를 사용한다고 가정합니다.
import Dashboard from './pages/Dashboard'; 
import FeedbackDetail from './pages/FeedbackDetail';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import WorkSpace from './pages/WorkSpace';

// 💡 [추가] useAuth 훅을 임포트합니다.
import { useAuth } from './hooks/useAuth'; // 실제 경로에 맞게 수정해주세요. 
import RedirectOnAuth from './components/RedirectOnAuth';

// // 💡 [추가] 루트 경로 '/'에서 리다이렉트를 처리할 컴포넌트 정의
// const RootRedirect: React.FC = () => {
//     const { isAuthenticated } = useAuth();
    
//     // 🔑 로그인 상태면 즉시 /dashboard로 리다이렉트
//     if (isAuthenticated) {
//         return <Navigate to="/dashboard" replace />;
//     }
    
//     // 🔑 로그아웃 상태면 LandingPage를 렌더링 (요청하신 대로)
//     return <LandingPage />;
// };

const App: React.FC = () => {
  // 💡 [추가] useAuth 훅에서 인증 상태를 가져옵니다.
  const { isAuthenticated, isAuthChecking } = useAuth();

  // 💡 [처리] 인증 상태 확인 중일 때 로딩 화면을 보여줍니다.
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        인증 상태 확인 중...
      </div>
    );
  }

  // 💡 루트 경로 (/)의 조건부 렌더링 컴포넌트
  // const RootComponent = isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <Routes>
        {/* 💡 [수정] 루트 경로('/')에 조건부 컴포넌트를 할당 */}
        <Route path="/" element={ <RedirectOnAuth component = {LandingPage} mode="unauthenticated" redirectPath='/dashboard'/>} /> 
        {/* 나머지 경로는 그대로 유지 */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<RedirectOnAuth component={Login} mode="unauthenticated" />} />
        <Route path="/register" element={<RedirectOnAuth component={Register} mode="unauthenticated" />} />
        <Route path="/dashboard" element={<RedirectOnAuth component={Dashboard} mode="protected" />} />
        
        {/* WorkSpace는 메모 등록 페이지로 사용되므로, 로그인된 사용자만 접근하도록 보호하는 것이 좋습니다. */}
        {/* WorkSpace와 Dashboard 경로를 명확히 구분하여 사용하세요. */}
        <Route path="/workspace" element={<RedirectOnAuth component={WorkSpace} mode="protected" />} />
        <Route path="/dashboard" element={<RedirectOnAuth component={Dashboard} mode="protected" />} />
        
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;

// useNavigate의 nav 호출시
// URL변경 -> 현재 위치상태 변경(Location) -> 최상위 컴포넌트가 상태변화 감지 -> 컴포넌트 재실행

// 전역 상태값을 관리하는 방법
// Context API + Hooks