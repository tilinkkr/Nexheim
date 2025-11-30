import React from 'react';
import type { HypeRatioData } from '../../hooks/useHypeRatio';

interface Props {
    data: HypeRatioData | null;
    loading?: boolean;
    error?: string | null;
}

function StatusBadge({ status }: { status: Props['data'] extends null ? never : string }) {
    if (!status) return null;
    const s = String(status);
    const color = s === 'overhyped' ? 'text-red-600' : s === 'balanced' ? 'text-green-600' : 'text-yellow-600';
    return <div className={`font-semibold ${color}`}>{s.toUpperCase()}</div>;
}

export default function HypeRatioCard({ data, loading, error }: Props) {
    React.useEffect(() => {
        console.log('HypeRatioCard mounted', data?.policyId ?? 'no-policy');
    }, [data?.policyId]);

    if (loading) return <div className="p-4 rounded bg-white shadow">Loading hype analysis…</div>;
    if (error) return <div className="p-4 rounded bg-red-50 text-red-700">Error: {error}</div>;
    if (!data) return <div className="p-4 rounded bg-gray-50">No data</div>;

    const { ratio, status, hypeScore, priceChange, breakdown, explanation } = data;

    return (
        <div className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500">Hype-to-Price Ratio</div>
                    <div className="text-4xl font-bold">{ratio.toFixed(1)}x</div>
                    <StatusBadge status={status} />
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500">Hype Score</div>
                    <div className="text-2xl font-semibold">{hypeScore}/100</div>
                    <div className="text-xs text-gray-500 mt-1">Price change: {(priceChange * 100).toFixed(2)}%</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">Breakdown</div>
                <div className="space-y-2">
                    {Object.entries(breakdown).map(([k, v]) => {
                        const pct = Math.min(100, Math.round(Number(v)));
                        return (
                            <div key={k} className="flex items-center">
                                <div className="w-24 text-xs text-gray-600">{k.replace('_', ' ')}</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded mx-2">
                                    <div style={{ width: `${pct}%` }} className="h-2 rounded bg-blue-500" />
                                </div>
                                <div className="w-12 text-xs text-gray-600">{pct}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 text-sm text-gray-500">
                {explanation ?? 'No explanation available.'}
            </div>
            <div className="mt-2 text-xs text-gray-400">Last update: {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'unknown'}</div>
        </div>
    );
}
