import {useState} from 'react';

export const useCounter = (initial: number = 0) => {
    const [count, setCount] = useState(initial);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(initial);

    return {count, increment, decrement, reset}
};