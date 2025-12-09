import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage'; 
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import type { RegisterResponse } from '../types/auth'; // 💡 타입 사용을 위해 import 가정

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // isRegistered 상태를 복원하여 이메일 인증 안내 화면에 사용합니다.
    const [isRegistered, setIsRegistered] = useState(false); 
    const nav = useNavigate();

    const handleCloseToast = () => setError(''); 

    const validate = (): boolean => {
        setError(''); 
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('🚨 유효한 이메일 주소를 입력해주세요.');
            return false;
        }

        if (password.length < 8) {
            setError('🚨 비밀번호는 최소 8자 이상이어야 합니다.');
            return false;
        }
        
        return true; 
    }

    const handle = async () => {
        if (!validate()) {
            return;
        }

        try {
            // 💡 [수정] 서버 응답 타입 명시
            const response: RegisterResponse = await authService.register(email, password);
            
            // 즉시 로그인 정책일 경우
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                nav('/dashboard');
            } 
            // 이메일 인증 정책일 경우 (토큰이 없거나 isVerificationRequired 플래그가 있는 경우)
            else if (response.isVerificationRequired || !response.token) {
                setIsRegistered(true); // 인증 안내 화면 표시
            }
            
        } catch (e: any) {
            // 서버 측 에러 처리
            const serverMessage = e.response?.data?.message || '등록에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.';
            setError(`🚨 ${serverMessage}`);
        }
    }

    // 💡 [복원 및 디자인 적용] 이메일 인증 안내 화면
    if (isRegistered) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
                <div className="w-full max-w-sm md:max-w-md animate-fade-in-up">
                    <Card 
                        title="" 
                        className="p-10 md:p-12 bg-gray-800 shadow-xl shadow-black/40 rounded-xl border border-gray-700"
                    >
                        <h2 className="text-3xl font-light text-blue-400 mb-2 tracking-widest uppercase">
                            AI Note
                        </h2>
                        <p className="text-xl font-bold text-gray-200 mb-8">
                            등록 완료
                        </p>
                        <p className="mt-4 text-gray-400 leading-relaxed">
                            가입하신 이메일 (<strong>{email}</strong>)을 확인하여 인증 링크를 클릭해 주세요.
                        </p>
                        <Button onClick={() => nav('/login')} className="mt-8 w-full text-lg bg-blue-700/80 hover:bg-blue-600 transition-all duration-150 font-semibold">
                            로그인 페이지로 이동
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    // 💡 [디자인 적용] 회원가입 폼
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4 transition-colors duration-500">
            {error && (
                <ToastMessage 
                    message={error} 
                    variant="error"
                    onClose={handleCloseToast}
                />
            )}
            
            <div className="w-full max-w-sm md:max-w-md">
                <div className="animate-fade-in-up">
                    <Card 
                        title="" 
                        className="p-10 md:p-12 lg:p-14 bg-gray-800 shadow-xl shadow-black/40 rounded-xl border border-gray-700"
                    >
                        <p className="text-xl font-bold text-gray-200 mb-8">
                            회원가입
                        </p>
                        {/* 입력 필드 */}
                        <Input 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                            className="mb-5 w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-700 focus:bg-gray-700 focus:border-blue-400 transition duration-300"
                        />
                        <Input 
                            placeholder="Password (최소 8자)" 
                            type="password" 
                            value={password} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                            className="mb-10 w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-700 focus:bg-gray-700 focus:border-blue-400 transition duration-300"
                        />
                        
                        {/* 버튼 */}
                        <Button 
                            onClick={handle}
                            className="w-full text-lg bg-blue-700/80 hover:bg-blue-600 transition-all duration-150 font-semibold active:scale-[0.99]"
                        >
                            회원가입
                        </Button>
                        
                        {/* 로그인 링크 */}
                        <p className="mt-8 text-center text-sm text-gray-500">
                            이미 계정이 있으신가요? 
                            <a href="/login" className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors">
                                로그인하기
                            </a>
                        </p>

                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Register;