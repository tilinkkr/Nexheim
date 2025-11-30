import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RugMeterProps {
    policyId: string;
}

export function RugMeter({ policyId }: RugMeterProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRugScore();
    }, [policyId]);

    const fetchRugScore = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5001/api/tokens/${policyId}/rug-score`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch rug score:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse h-32 bg-gray-800 rounded-xl"></div>;
    if (!data) return null;

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-500';
            case 'HIGH': return 'text-orange-500';
            case 'MEDIUM': return 'text-yellow-500';
            default: return 'text-green-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Rug Probability</h3>
                    <p className="text-sm text-gray-400">Safety Analysis</p>
                </div>
                <div className={`text-2xl font-bold ${getRiskColor(data.riskLevel)}`}>
                    {data.riskScore}%
                </div>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                <div
                    className={`h-2.5 rounded-full ${getRiskColor(data.riskLevel).replace('text-', 'bg-')}`}
                    style={{ width: `${data.riskScore}%` }}
                ></div>
            </div>

            <div className="space-y-2">
                {data.warnings.length > 0 ? (
                    data.warnings.map((warning: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-red-300 bg-red-900/20 p-2 rounded">
                            ⚠️ {warning}
                        </div>
                    ))
                ) : (
                    <div className="flex items-center gap-2 text-xs text-green-300 bg-green-900/20 p-2 rounded">
                        ✅ No major red flags detected
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
                <div>Liquidity Risk: {data.breakdown.liquidityRisk}%</div>
                <div>Holder Risk: {data.breakdown.holderRisk}%</div>
            </div>
        </motion.div>
    );
}
