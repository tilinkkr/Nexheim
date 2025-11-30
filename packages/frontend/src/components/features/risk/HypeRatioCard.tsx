import { useHypeRatio } from '../../../hooks/useHypeRatio';
import { motion } from 'framer-motion';

interface HypeRatioCardProps {
    policyId: string;
    tokenName?: string;
}

export function HypeRatioCard({ policyId, tokenName }: HypeRatioCardProps) {
    const { data, loading, error } = useHypeRatio(policyId, tokenName);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-purple-500/20 rounded w-1/2"></div>
                    <div className="h-20 bg-purple-500/20 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
                <p className="text-red-400">Failed to load: {error}</p>
            </div>
        );
    }

    if (!data) return null;

    const getStatusColor = () => {
        switch (data.status) {
            case 'overhyped': return 'from-red-500 to-orange-500';
            case 'undervalued': return 'from-green-500 to-emerald-500';
            case 'balanced': return 'from-blue-500 to-cyan-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20"
        >
            <h3 className="text-xl font-bold mb-4">🎯 Hype-to-Price Ratio</h3>

            <div className={`text-6xl font-bold bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-4`}>
                {data.ratio}
            </div>

            <p className="text-2xl mb-6">{data.message}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Hype Score</div>
                    <div className="text-2xl font-bold text-purple-400">{data.hypeScore}/100</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Price Change</div>
                    <div className={`text-2xl font-bold ${parseFloat(data.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(data.priceChange) >= 0 ? '+' : ''}{data.priceChange}%
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-400">{data.explanation}</p>
        </motion.div>
    );
}
