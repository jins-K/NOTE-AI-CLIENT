// src/hooks/useLogin.ts
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || '로그인 실패. 이메일 또는 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errorMsg };
};
