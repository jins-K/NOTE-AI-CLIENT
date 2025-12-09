import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, errorMsg } = useAuth();

  const handleSubmit = () => login(email, password);

  return (
    // 배경: 표준적인 다크 모드 배경 (gray-900) 유지
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4 transition-colors duration-500">
      
      <div className="w-full max-w-sm md:max-w-md">
        
        <div className="animate-fade-in-up">
            <Card 
              title="" 
              className="p-10 md:p-12 lg:p-14 bg-gray-800 shadow-xl shadow-black/40 rounded-xl border border-gray-700"
            >
              
              {/* 제목: "AI Note"에만 강조색 적용 */}
              <h2 className="text-3xl font-light text-blue-400 mb-2 tracking-widest uppercase">
                AI Note
              </h2>
              
              {/* 💡 [수정] 설명: 텍스트 좌우 * 표시 제거 */}
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                아이디어에 집중하고, 더 깊은 통찰을 기록하세요.
              </p>

              {errorMsg && (
                <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-5 border border-red-700 font-medium">
                    {errorMsg}
                </p>
              )}

              {/* 입력 필드: focus 시 테두리 색상에 Blue 계열 적용 */}
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-5 w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-700 focus:bg-gray-700 focus:border-blue-400 transition duration-300"
              />

              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-10 w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-700 focus:bg-gray-700 focus:border-blue-400 transition duration-300"
              />

              {/* 💡 [수정] 버튼 스타일: Blue-700 계열의 투명도(80%)를 적용하여 배경과 동화되도록 조정 */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full text-lg bg-blue-700/80 hover:bg-blue-600 transition-all duration-150 disabled:bg-gray-700 disabled:cursor-not-allowed font-semibold active:scale-[0.99]"
              >
                {loading ? '인증 확인 중...' : '계속하기'} 
              </Button>
            
              {/* 가입 링크: Blue-400으로 색상 지정 */}
              <p className="mt-8 text-center text-sm text-gray-500">
                계정이 없으신가요? 
                <a href="/register" className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors">
                    지금 가입하기
                </a>
              </p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;