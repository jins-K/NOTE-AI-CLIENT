import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useLogin } from '../hooks/useLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, errorMsg } = useLogin();

  const handleSubmit = () => login(email, password);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      {/* 카드 폭: 모바일 100%, 데스크톱 45%, 최소폭 320px */}
      <div className="w-full md:w-[45%] lg:w-[40%] min-w-[320px]">
        <Card title="AI Note 로그인" className="p-6 md:p-8 lg:p-10">
          <p className="text-sm md:text-base lg:text-lg text-gray-500 mb-6">
            당신의 생각을 저장하고 AI와 함께 발전시키세요.
          </p>

          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full"
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-base md:text-lg"
          >
            {loading ? '로딩중...' : '로그인'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
