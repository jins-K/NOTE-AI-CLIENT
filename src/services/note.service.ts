import type { NoteRegisterResponse, NoteListResponse } from '../types/note';
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

    getNote: async(id: string): Promise<NoteRegisterResponse> => {
        const res = await api.get(`/note/${id}`);
        return res.data;
    }
}