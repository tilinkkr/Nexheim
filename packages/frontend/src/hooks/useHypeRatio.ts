import { useEffect, useState } from 'react';

export type HypeBreakdown = {
    twitter: number;
    reddit: number;
    google_trends: number;
    telegram: number;
};

export type HypeRatioData = {
    policyId: string;
    tokenName?: string;
    window: string;
    hypeScore: number;       // 0..100
    priceChange: number;     // decimal, e.g., 0.025 = +2.5%
    ratio: number;           // e.g., 29.6
    status: 'overhyped' | 'balanced' | 'whale-lurk' | 'unknown';
    breakdown: HypeBreakdown;
    explanation?: string;
    timestamp?: number;
    cached?: boolean;
};

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001';

export function useHypeRatio(policyId: string | null, windowStr = '60m') {
    const [data, setData] = useState<HypeRatioData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!policyId) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        let mounted = true;
        const controller = new AbortController();

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE}/api/tokens/${encodeURIComponent(policyId)}/hype-ratio?window=${encodeURIComponent(windowStr)}`, { signal: controller.signal });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }
                const json = await res.json();
                if (!mounted) return;
                setData(json);
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                setError(err.message || 'Failed to fetch hype ratio');
                setData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, [policyId, windowStr]);

    return { data, loading, error };
}
