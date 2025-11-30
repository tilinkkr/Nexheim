import { useState, useEffect } from 'react';
import { RugProbabilityData } from '../types/risk.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export function useRugProbability(policyId: string) {
    const [data, setData] = useState<RugProbabilityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!policyId) return;

        const fetchRugProbability = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_URL}/api/memecoins/${policyId}/rug-probability`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();
                setData(result);

            } catch (err) {
                console.error('Rug probability fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch');
            } finally {
                setLoading(false);
            }
        };

        fetchRugProbability();
    }, [policyId]);

    return { data, loading, error };
}
