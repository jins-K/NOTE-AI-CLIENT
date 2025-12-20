import {useQuery} from '@tanstack/react-query';

export interface Feedback { 
    id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt?: string;
}


const mockFeedbacks: Feedback[] = [
    {id: '1', question: 'How was your experience?', answer: 'Great!', createdAt: '2024-01-01T10:00:00Z'},
    {id: '2', question: 'Would you recommend us?', answer: 'Absolutely!', createdAt: '2024-01-02T11:30:00Z'},
    {id: '3', question: 'Any suggestions for improvement?', answer: 'More features would be nice.', createdAt: '2024-01-03T09:15:00Z'},  
];

export const useFeedback = () => {
    // return useQuery(['feedbacks'], fetchFeedbacks);
    return useQuery({
        queryKey : ['feedbacks'], 
        queryFn : async () => mockFeedbacks,
    });
}