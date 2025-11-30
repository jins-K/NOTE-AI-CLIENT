import type { RegisterResponse } from '../types/auth';
import { api } from './api';

export const authService = {
    register: async (email: string, password: string): Promise<RegisterResponse> => {
        const res = await api.post<RegisterResponse>('/auth/register', { email, password });
        return res.data;
    } ,
    login: async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token } = res.data;
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } ,
    logout: () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
    }

}