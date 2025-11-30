import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
// 💡 컴포넌트 이름은 Toast 패턴을 반영하여 ToastMessage로 가정합니다.
import ToastMessage from '../components/ToastMessage'; 
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegitstered] = useState(false);
    const nav = useNavigate();

    // 💡 토스트 메시지 닫기 핸들러: error 상태를 비워서 메시지를 숨깁니다.
    const handleCloseToast = () => setError(''); 

    const validate = (): boolean => {
        // 🚀 유효성 검사 시작 시 error 상태 초기화
        setError(''); 
        
        // 1. 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('🚨 유효한 이메일 주소를 입력해주세요.');
            return false;
        }

        // 2. 비밀번호 길이 검사
        if (password.length < 8) {
            setError('🚨 비밀번호는 최소 8자 이상이어야 합니다.');
            return false;
        }
        
        // 모든 검사 통과
        return true; 
    }

    const handle = async () => {
        // 🚀 [중요 수정] validate 함수가 false를 반환하면 즉시 함수를 중단합니다.
        if (!validate()) {
            return;
        }

        try {
            // 💡 등록 성공 시 별도의 토스트 메시지를 띄우지 않고 바로 이동
            const response = await authService.register(email, password);
            localStorage.setItem('authToken', response.token);
            nav('/dashboard');
            // setIsRegitstered(true);
            
        } catch (e) {
            // 서버 측 에러 처리 및 메시지 설정
            setError('🚨 등록에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.');
        }
    }

    // email 발송
    // if (isRegistered) {
    //     return (
    //         <div className="max-w-md mx-auto p-6 text-center">
    //             <Card title="등록 완료">
    //                 <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 환영합니다!</h2>
    //                 <p className="mt-4 text-gray-700">
    //                     가입하신 이메일 (<strong>{email}</strong>)로 인증 메일을 발송했습니다.
    //                     서비스 이용을 위해 메일함에서 **인증 링크를 클릭**해 주세요.
    //                 </p>
    //                 <Button onClick={() => nav('/login')} className="mt-6">로그인 페이지로 이동</Button>
    //             </Card>
    //         </div>
    //     );
    // }

    return (
        // 💡 ToastMessage의 fixed 위치 지정을 위해 최상위 div의 스타일을 조정하거나,
        // ToastMessage가 fixed position을 가질 경우 그냥 둡니다.
        <div className="relative min-h-screen">
            
            {/* 🚀 ToastMessage 컴포넌트 사용 및 속성 전달 */}
            {/* variant는 'error'로 고정하고, 메시지가 있을 때만 onClose가 작동하도록 합니다. */}
            {error && (
                <ToastMessage 
                    message={error} 
                    variant="error"
                    onClose={handleCloseToast} // 닫기 버튼을 누르면 error 상태가 비워짐
                />
            )}
            
            <div className="max-w-md mx-auto p-6">
                <Card title="Register">
                    <Input 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                        className="mb-3"
                    />
                    <Input 
                        placeholder="Password (최소 8자)" 
                        type="password" 
                        value={password} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                        className="mb-3"
                    />
                    <Button onClick={handle}>Register</Button>
                </Card>
            </div>
        </div>
    )
}

export default Register;