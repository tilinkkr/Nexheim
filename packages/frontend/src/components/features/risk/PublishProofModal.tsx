import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublishProof } from '../../../hooks/usePublishProof';
import { X, ShieldCheck, Link as LinkIcon, Loader2 } from 'lucide-react';

interface PublishProofModalProps {
    token: any;
    riskData: any;
    onClose: () => void;
}

export function PublishProofModal({ token, riskData, onClose }: PublishProofModalProps) {
    const { publishProof, loading, success, error } = usePublishProof();

    const handlePublish = async () => {
        await publishProof(token.policyId, riskData);
        // Don't auto-close immediately so user can see the hash
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
                        <h3 className="text-xl font-bold text-white">Publish Risk Proof</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {success ? (
                            <div className="text-center py-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <ShieldCheck className="w-10 h-10 text-purple-500" />
                                </motion.div>
                                <h4 className="text-2xl font-bold text-white mb-2">Proof Published!</h4>
                                <p className="text-gray-400 mb-6 text-sm">
                                    The risk analysis has been cryptographically hashed and recorded on the Cardano blockchain.
                                </p>

                                <div className="bg-black/30 rounded-xl p-4 mb-6 text-left space-y-3">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Decision Hash</div>
                                        <div className="font-mono text-xs text-purple-300 break-all">{success.decisionHash}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Transaction Hash</div>
                                        <a
                                            href={success.explorerUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-mono text-xs text-blue-400 break-all hover:underline flex items-center gap-1"
                                        >
                                            {success.txHash} <LinkIcon size={10} />
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className="text-gray-300 text-sm mb-4">
                                        Generate a permanent, verifiable proof of this risk analysis on the Cardano blockchain.
                                        This increases transparency and allows users to verify historical risk assessments.
                                    </p>

                                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Token</span>
                                            <span className="text-white font-bold">{token.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Risk Score</span>
                                            <span className={`font-bold ${token.trust_score < 50 ? 'text-red-400' : 'text-green-400'}`}>
                                                {token.trust_score}/100
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Analysis Date</span>
                                            <span className="text-white">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePublish}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Publishing to Cardano...
                                        </>
                                    ) : (
                                        'Publish Proof On-Chain'
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
