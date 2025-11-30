import { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

export function useTrade() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<any>(null);

    const executeTrade = async (token: any, amount: number, type: 'buy' | 'sell' = 'buy') => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.post(`${API_URL}/trade`, {
                token,
                amount,
                type
            });
            setSuccess(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Trade failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { executeTrade, loading, error, success, reset: () => setSuccess(null) };
}
