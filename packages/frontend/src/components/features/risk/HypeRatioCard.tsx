import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HypeRatioProps {
    policyId: string;
}

export function HypeRatioCard({ policyId }: HypeRatioProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHypeRatio();
    }, [policyId]);

    const fetchHypeRatio = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5001/api/tokens/${policyId}/hype-ratio`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch hype ratio:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse h-32 bg-gray-800 rounded-xl"></div>;
    if (!data) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overhyped': return 'text-red-400';
            case 'undervalued': return 'text-green-400';
            case 'cautious': return 'text-yellow-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Hype-to-Price Ratio</h3>
                    <p className="text-sm text-gray-400">Market Sentiment Analysis</p>
                </div>
                <div className={`text-2xl font-bold ${getStatusColor(data.status)}`}>
                    {data.ratio}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-opacity-20 ${getStatusColor(data.status).replace('text-', 'bg-')} ${getStatusColor(data.status)}`}>
                        {data.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">Risk: {data.risk.toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-300">{data.explanation}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Hype Score</div>
                    <div className="font-mono text-white">{data.hypeScore}/100</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Price 24h</div>
                    <div className={`font-mono ${parseFloat(data.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.priceChange}%
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Mentions</div>
                    <div className="font-mono text-white">{data.breakdown.socialMentions}</div>
                </div>
            </div>
        </motion.div>
    );
}
