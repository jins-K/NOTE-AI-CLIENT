import React , { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 전역 인증 상태, 로그인, 로그아웃 등의 기능을 제공
 */

// 1. ContextType 정의 
interface AuthContextType {
    // 💡 [수정] login 함수는 성공 여부를 알리기 위해 Promise<boolean>을 반환하도록 수정
    isAuthenticated: boolean;
    isAuthChecking: boolean;
    login: (email: string, password: string) => Promise<boolean>; 
    logout: () => Promise<void>;
    loading: boolean;
    errorMsg: string;
}

// Context 객체 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. AuthProvider 컴포넌트 생성(상태 저장소)
// Children prop의 구조 분해 할당 이름을 'children' (관례)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate(); 

    // checkAuthStatus: 서버에 인증 상태를 확인
    const checkAuthStatus = useCallback(async () => {
        setIsAuthChecking(true);
        try {
            await authService.checkAuthStatus();
            setIsAuthenticated(true);
        } catch(e) {
            setIsAuthenticated(false);
        } finally {
            setIsAuthChecking(false);
        }
    }, []);

    // 로그인: Promise<boolean>을 반환하도록 로직 수정
    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        if (!email || !password) {
            setErrorMsg('이메일과 비밀번호를 입력해주세요.');
            return false; // 💡 [추가] 실패 시 false 반환
        }

        setLoading(true);
        setErrorMsg('');

        try {
            await authService.login(email, password);
            setIsAuthenticated(true);
            navigate("/dashboard"); // 💡 [수정] 로그인 성공 후 명확한 경로 권장
            return true; // 💡 [추가] 성공 시 true 반환
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || '로그인 실패. 이메일 또는 비밀번호를 확인하세요.');
            return false; // 💡 [추가] 실패 시 false 반환
        } finally {
            setLoading(false);
        }
    }, [navigate]); // navigate를 의존성에 포함
    

    // 로그아웃
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setIsAuthenticated(false);
            navigate("/login"); // 💡 [수정] 로그아웃 후 /login 경로 권장
        } catch(e) {
            console.error("Logout failed: ", e);
            setIsAuthenticated(false);
            navigate("/login");
        }
    }, [navigate]);

    const { pathname } = useLocation();

    useEffect(() => {
        // 💡 로그인이 필요 없는 공개 경로 리스트
        const publicPaths = ['/', '/login', '/register', '/demo'];

        // 현재 경로가 공개 경로에 포함되어 있지 않을 때만 상태 확인
        // 또는, 이미 인증되었다면 중복 확인 방지
        if (!publicPaths.includes(pathname) && !isAuthenticated) {
            checkAuthStatus();
        }
    }, [checkAuthStatus, pathname, isAuthenticated]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated, isAuthChecking, login, logout, loading, errorMsg
        }}>
            {children} {/* 💡 [수정] 구조 분해 할당 이름에 맞게 children 사용 */}
        </AuthContext.Provider>
    );
};

// 3. useAuth 훅 생성
// useContext(react 내장 훅)로 AuthContext 접근)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
    }
    return context;
}


// JSX코드를 사용하는 곳은 확장자를 tsx, 타입스크립트만 사용하면 ts .. 컴파일에러 발생

// 단일 책임원칙 , 인증상태의 중앙 집중화, 상태변경로직은 캡슐화되고 외부에서 접근 불가하며 제공하는 함수로만 가능

// Context == 저장소, 인터페이스를 정의한다
// Provider == 데이터 공급, 실제 값을 제공하는 Context의 하위 컴포넌트,  .value로 생성한 것을 전달한다.
// Consumer == 소비자, useContext 훅을 사용한다.

// 상태관리
// local state (useState , useReducer)
// Context
// redux, zustand, recoil

// useState : unmount시 state 제거
// useState 호출 순서대로 Fiber에서 값을 가져오는 방식으로 상태를 저장한 것을 유지한다
// 컴포넌트 안에서만 사용되며 전달하려면 props drilling 해야한다