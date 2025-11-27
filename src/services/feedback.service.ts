import { api } from './api';

export const feedbackService = {
    createFeedback: async (payload: { note: string}) => {
        const res = await api.post('/feedback', payload);
        return res.data;
    },
    getFeedbacks: async () => {
        const res = await api.get('/feedback');
        return res.data;
    },
    getFeedback: async (id: string) => {
        const res = await api.get(`/feedback/${id}`);
        return res.data;
    }
}