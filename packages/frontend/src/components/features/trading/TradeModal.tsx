import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrade } from '../../../hooks/useTrade';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface TradeModalProps {
    token: any;
    onClose: () => void;
}

export function TradeModal({ token, onClose }: TradeModalProps) {
    const [amount, setAmount] = useState('100');
    const { executeTrade, loading, success, error } = useTrade();

    const handleTrade = async () => {
        await executeTrade(token, parseFloat(amount));
        setTimeout(onClose, 3000); // Auto close on success
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <h3 className="text-xl font-bold text-white">Trade {token.symbol}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {success ? (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </motion.div>
                                <h4 className="text-2xl font-bold text-white mb-2">Trade Executed!</h4>
                                <p className="text-gray-400 mb-4">Transaction Hash:</p>
                                <a
                                    href={success.explorerUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono text-blue-400 bg-blue-900/20 px-3 py-2 rounded-lg break-all hover:bg-blue-900/40 transition-colors"
                                >
                                    {success.txHash}
                                </a>
                            </div>
                        ) : (
                            <>
                                {/* Risk Warning */}
                                <div className={`mb-6 p-4 rounded-xl border ${token.trust_score < 50 ? 'bg-red-900/20 border-red-500/30' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className={`w-6 h-6 shrink-0 ${token.trust_score < 50 ? 'text-red-500' : 'text-yellow-500'}`} />
                                        <div>
                                            <h4 className={`font-bold ${token.trust_score < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                                                High Risk Warning
                                            </h4>
                                            <p className="text-sm text-gray-300 mt-1">
                                                This token has a trust score of {token.trust_score}/100.
                                                Liquidity is low and rug probability is high.
                                                Trade at your own risk.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Amount (ADA)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Balance: 1,250.00 ADA</span>
                                        <span>Max</span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Action */}
                                <button
                                    onClick={handleTrade}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Executing Trade...
                                        </>
                                    ) : (
                                        'Confirm Trade Anyway'
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
