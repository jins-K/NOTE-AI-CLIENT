import type { NoteRegisterResponse, NoteListResponse, Note } from '../types/note';
import { api } from './api';

export const noteService = {
    register: async(content: string): Promise<NoteRegisterResponse> => {
        const res = await api.post('/note', {content});

        return res.data;
    },

    getNotes: async(page: number = 1, limit: number = 10): Promise<NoteListResponse> => {
        const res = await api.get('/note', {
            params: { page, limit }
        })
        return res.data;
    },

    getNote: async(id: string): Promise<Note> => {
        const res = await api.get(`/note/${id}`);
        return res.data;
    },
    
    updateNote: async(id: string, content: string): Promise<NoteRegisterResponse> => {
        const res = await api.put(`/note/${id}`, { content });
        return res.data;
    },

    deleteNote: async(id: string): Promise<void> => {
        await api.delete(`/note/${id}`);
    },
    
    askAI: async(query: string, context: string): Promise<string> => {
        try {
            const response = await api.post('ai/chat', {
                query,
                context,
            });

            return response.data.answer;
        } catch (error) {
            console.error('AI Chat Error:', error);
            throw error;
        }
    },

    // 💡 추가: 검색 결과 인사이트 가져오기
    getSearchInsight: async (context: string): Promise<string> => {
        try {
            const res = await api.post('/ai/insight', { context });
            return res.data.insight;
        } catch (error) {
            console.error('인사이트 호출 실패:', error);
            throw error;
        }
    },

}