import { useMutation } from '@tanstack/react-query'
import { feedbackService } from '../services/feedback.service';

export const useAiFeedback = () => {
    return useMutation({
        mutationFn: (payload : { note: string }) => feedbackService.createFeedback(payload),
    });
}