import React, { type ElementType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RedirectOnAuthProps { 
    // 렌더링할 컴포넌트 자체를 props로 받는다. 
    component: ElementType;

    // 로그아웃 상태일 때 리다이렉트할 경로
    redirectPath?: string;

    // 보호 or 리다이렉트
    mode: 'protected' | 'unauthenticated';
}

/**
 * 모드에 따라 인증상태를 확인하여 리다이렉트하거나 컴포넌트를 렌더링하는 유틸리티 컴포넌트
 * @param mode 'protected' : 로그인해야 접근가능 , 아니면 리다이렉트
 * @param mode 'unauthenticated' : 로그아웃해야 접근가능 
 */
const RedirectOnAuth: React.FC<RedirectOnAuthProps> = ({
    component: Component,
    redirectPath = '/login',
    mode
}) => {
    const { isAuthenticated, isAuthChecking} = useAuth();

    // 1. 인증 확인 중
    if (isAuthChecking) {
        // 로딩 컴포넌트를 반환하거나 ,null을 반환 .. App.tsx에서 처리
        return null;
    }

    // 2. protected 모드 
    if (mode === 'protected') {
        if (isAuthenticated) {
            return <Component/>
        }
        return <Navigate to={redirectPath} replace />;
    }

    // 3. unauthenticated 모드
    if (mode === 'unauthenticated') {
        // 로그아웃 되어있으면 컴포넌트 렌더링
        if (!isAuthenticated) {
            return <Component />
        }
        // 아니면 리다이렉트
        return <Navigate to="/dashboard" replace />;
    }

    return <Component/>
}

export default RedirectOnAuth;