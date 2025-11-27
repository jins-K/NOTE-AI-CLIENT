import {useState, useEffect} from 'react';

export const useFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        
        setLoading(true);
        fetch(url)
            .then(response => response.json())
            .then(json => mounted && setData(json))
            .catch(err => mounted && setError(err))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [url]);

    return {data, loading, error};
}