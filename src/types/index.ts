export type User = {
    id: string;
    email: string; 
    role: 'user' | 'admin';
}

export type Feedback = {
    id: string;
    question: string;
    answer: string;
    createdAt: string;
}