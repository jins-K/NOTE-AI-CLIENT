import { api } from './api';

export const authService = {
    register: async (email: string, password: string) => {
        await api.post('/auth/register', { email, password });
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