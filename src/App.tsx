// /src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import NoteDetail from './pages/NoteDetail';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import WorkSpace from './pages/WorkSpace';
import { useAuth } from './hooks/useAuth';
import RedirectOnAuth from './components/RedirectOnAuth';

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
        {/* 1. 새 메모 기록 (ID 없음) */}
        <Route path="/workspace" element={<RedirectOnAuth component={WorkSpace} mode="protected" />} />
        {/* 2. 기존 메모 수정 (ID 있음) */}
        <Route path="/workspace/:id" element={<RedirectOnAuth component={WorkSpace} mode="protected" />} />
        <Route path="/dashboard" element={<RedirectOnAuth component={Dashboard} mode="protected" />} />
        
        <Route path="/note/:id" element={<NoteDetail />} />
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


// React 컴포넌트 = Pascal Case (UserProfile.tsx)
// Route, Page  = Pascal Case (Dashboard.tsx)

// Service, Api = Dot separation / Camel Case  (member.service.ts / memberService)
// custom hooks = use + CamelCase

// utility , helper = Dot separation / Camel Case (formatUtils.ts / date.util.ts)

// redux slices = Dot separation (cart.slice.ts)
// dto, model, schema = Dot separation (cart.slice.ts)

// type definition , interface = Dot separation / Types (apiTypes.ts)
// config = Dot separation / Kebab-case (db-config.ts / db.config.ts)
// test files = Dot separation / Kebab-case (db-config.ts / db.config.ts)
