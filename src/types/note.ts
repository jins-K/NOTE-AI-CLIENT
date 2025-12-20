export interface NoteRegisterRequest {
    content: string;
}

export interface Note {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoteRegisterResponse {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoteListResponse {
    notes: Note[];
    pagination: {
        currentPage: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    }
}