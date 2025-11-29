import { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

export function usePublishProof() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<any>(null);

    const publishProof = async (policyId: string, riskData: any) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.post(`${API_URL}/publish-proof`, {
                policyId,
                riskData
            });
            setSuccess(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Publish failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { publishProof, loading, error, success, reset: () => setSuccess(null) };
}
