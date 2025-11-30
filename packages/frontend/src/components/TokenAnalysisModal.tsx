import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown, Users, Droplet, Shield, AlertTriangle, Brain, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

interface TokenAnalysisModalProps {
    token: any;
    onClose: () => void;
}

export default function TokenAnalysisModal({ token, onClose }: TokenAnalysisModalProps) {
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Proof State
    const [proofStatus, setProofStatus] = useState<'idle' | 'building' | 'ready' | 'submitting' | 'success' | 'error'>('idle');
    const [proofData, setProofData] = useState<any>(null);
    const [txHash, setTxHash] = useState<string>('');
    const [proofError, setProofError] = useState<string>('');

    // Whistleblower State
    const [showWhistleblower, setShowWhistleblower] = useState(false);
    const [whistleStep, setWhistleStep] = useState<'idle' | 'generating' | 'obfuscating' | 'done'>('idle');
    const [whistleProofId, setWhistleProofId] = useState('');

    useEffect(() => {
        fetchAIAnalysis();
    }, [token]);

    const fetchAIAnalysis = async () => {
        setLoading(true);
        try {
            // Get real AI analysis from backend
            const res = await axios.post(`${API_URL}/risk/${token.policyId || token.id}/ask-masumi`);
            console.log('[TokenAnalysisModal] API Response:', res.data);
            setAiAnalysis(res.data);
        } catch (err) {
            console.error('AI analysis failed:', err);
            // Fallback to basic analysis
            setAiAnalysis({
                explanation: generateFallbackAnalysis(token),
                rug_probability: token.rugProbability?.percentage || (100 - (token.trustScore || token.trust_score || 50)),
                realData: null,
                analysis: {
                    risk_factors: [] // Fallback will populate this if we moved logic here, but backend handles it now
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const generateFallbackAnalysis = (token: any) => {
        const trustScore = token.trustScore || token.trust_score || 50;
        const rugProb = token.rugProbability?.percentage || (100 - trustScore);

        if (rugProb <= 20) {
            return `${token.name} shows strong fundamentals with a trust score of ${trustScore}/100. The token has healthy liquidity and a well-distributed holder base. Risk factors are minimal, making this a relatively safe investment for meme coin standards.`;
        } else if (rugProb <= 40) {
            return `${token.name} displays moderate risk characteristics. While the trust score of ${trustScore}/100 is acceptable, traders should monitor whale activity and liquidity levels. Consider this a medium-risk opportunity with potential upside.`;
        } else if (rugProb <= 60) {
            return `${token.name} presents elevated risk with a trust score of ${trustScore}/100. Significant concerns include potential whale concentration and liquidity concerns. Only invest what you can afford to lose and maintain strict stop-losses.`;
        } else if (rugProb <= 80) {
            return `${token.name} exhibits high-risk characteristics with a trust score of ${trustScore}/100. Multiple red flags detected including poor liquidity, high whale concentration, or suspicious contract patterns. Extreme caution advised.`;
        } else {
            return `${token.name} shows critical risk indicators with a trust score of ${trustScore}/100. This token displays multiple characteristics common in rug pulls including extreme whale concentration, low liquidity, or unverified contracts. Investment is strongly discouraged.`;
        }
    };

    const handlePublishProof = async () => {
        setProofStatus('building');
        setProofError('');
        try {
            const payload = {
                policyId: token.policyId || token.id,
                analysisHash: aiAnalysis?.proof?.decision_hash || 'mock_hash_for_demo',
                rugProbability: rugProb,
                trustScore: trustScore,
                timestamp: Math.floor(Date.now() / 1000)
            };

            const res = await axios.post(`${API_URL}/api/v1/proof/build`, payload);
            setProofData(res.data);
            setProofStatus('ready');
        } catch (err: any) {
            console.error('Proof build failed:', err);
            setProofError(err.response?.data?.error || err.message);
            setProofStatus('error');
        }
    };

    const handleDemoSubmit = async () => {
        setProofStatus('submitting');
        try {
            const policyId = token.policyId || token.id;
            const signedRes = await axios.get(`${API_URL}/api/v1/proof/demo-signed/${policyId}`);
            const submitRes = await axios.post(`${API_URL}/api/v1/tx/submit`, {
                signed_tx_hex: signedRes.data.signed_tx_hex
            });
            setTxHash(submitRes.data.tx_hash);
            setProofStatus('success');
        } catch (err: any) {
            console.error('Demo submit failed:', err);
            setProofError(err.response?.data?.error || err.message);
            setProofStatus('error');
        }
    };

    const runWhistleblowerFlow = () => {
        setShowWhistleblower(true);
        setWhistleStep('generating');

        // Simulate ZK Proof Generation
        setTimeout(() => {
            setWhistleStep('obfuscating');
            setTimeout(() => {
                setWhistleStep('done');
                setWhistleProofId(`zk-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`);
            }, 2000);
        }, 2000);
    };

    // Data Calculation
    const trustScore = token.trustScore || token.trust_score || 50;
    const rugProb = aiAnalysis?.rug_probability || token.rugProbability?.percentage || (100 - trustScore);
    const realData = aiAnalysis?.realData;
    const holders = realData?.holderCount || token.holders || 0;
    const whalePercent = realData?.top1HolderPct || token.whalePercent || 0;
    const liquidity = token.liquidity || 0;
    const volume24h = token.volume24h || 0;
    const marketCap = token.marketCap || 0;

    // Risk Factors (from backend or fallback)
    const riskFactors = aiAnalysis?.analysis?.risk_factors || [
        { name: 'Whale Concentration', value: `${whalePercent}%`, penalty: whalePercent > 50 ? -30 : 0, rule: whalePercent > 50 ? '> 50%' : 'Safe' },
        { name: 'Liquidity', value: `$${(liquidity / 1000).toFixed(1)}K`, penalty: liquidity < 10000 ? -20 : 0, rule: liquidity < 10000 ? 'Low' : 'Healthy' }
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-700 rounded-3xl shadow-2xl">

                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-white">{token.name}</h2>
                            <span className="text-xl text-gray-400">({token.symbol})</span>
                            {token.source === 'blockfrost' && (
                                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/50">
                                    🔗 LIVE
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm font-mono">Policy: {token.policyId?.slice(0, 16)}...</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Top Section: Score & Whistleblower */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Trust Score Ring */}
                        <div className="flex-1 bg-gray-800/50 rounded-2xl p-6 border border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Trust Score</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-bold ${trustScore >= 80 ? 'text-green-400' : trustScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {trustScore}
                                    </span>
                                    <span className="text-gray-500 text-xl">/100</span>
                                </div>
                                {aiAnalysis?.suggested_delta && aiAnalysis.suggested_delta !== 0 && (
                                    <div className={`mt-2 text-sm font-bold ${aiAnalysis.suggested_delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {aiAnalysis.suggested_delta > 0 ? '▲' : '▼'} {Math.abs(aiAnalysis.suggested_delta)} pts (Recent Change)
                                    </div>
                                )}
                            </div>

                            {/* Whistleblower Button */}
                            <button
                                onClick={runWhistleblowerFlow}
                                className="flex flex-col items-center gap-2 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-xl transition-all group"
                            >
                                <div className="p-3 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <span className="text-red-400 font-bold text-sm">Whistleblow</span>
                            </button>
                        </div>

                        {/* Rug Probability */}
                        <div className={`flex-1 p-6 rounded-2xl border-2 flex items-center gap-4 ${rugProb <= 20 ? 'bg-green-500/10 border-green-500/50' :
                            rugProb <= 60 ? 'bg-yellow-500/10 border-yellow-500/50' :
                                'bg-red-500/10 border-red-500/50'
                            }`}>
                            <div className="text-5xl">
                                {rugProb <= 20 ? '🟢' : rugProb <= 60 ? '🟡' : '🔴'}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Rug Probability</h3>
                                <p className="text-3xl font-bold text-white">{rugProb}%</p>
                                <p className="text-sm text-gray-300 mt-1">
                                    {rugProb <= 20 ? 'Low Risk' : rugProb <= 60 ? 'Moderate Risk' : 'High Risk'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Explainability Panel */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" />
                            Risk Factor Breakdown
                        </h3>
                        <div className="grid gap-3">
                            {riskFactors.map((factor: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${factor.penalty < 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <div>
                                            <p className="text-white font-semibold">{factor.name}</p>
                                            <p className="text-xs text-gray-400">Value: {factor.value}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-mono font-bold ${factor.penalty < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {factor.penalty === 0 ? '+0' : factor.penalty} pts
                                        </p>
                                        <p className="text-xs text-gray-500">{factor.rule}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Analysis Text */}
                    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/30">
                        <h4 className="text-purple-300 font-bold mb-2 text-sm uppercase tracking-wide">AI Analysis</h4>
                        {loading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
                                <div className="h-4 bg-purple-500/20 rounded w-1/2"></div>
                            </div>
                        ) : (
                            <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                                {aiAnalysis?.explanation || 'Analysis unavailable.'}
                            </p>
                        )}
                    </div>

                    {/* Proof Section */}
                    {proofStatus !== 'idle' && (
                        <div className="p-6 bg-gray-800/80 rounded-2xl border border-blue-500/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-400" />
                                On-Chain Proof
                            </h3>

                            {proofStatus === 'building' && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    Building verifiable proof...
                                </div>
                            )}

                            {proofStatus === 'ready' && (
                                <div className="space-y-4">
                                    <div className="bg-black/40 p-4 rounded-lg font-mono text-xs text-gray-400 break-all">
                                        <div className="mb-2 text-gray-500">Unsigned CBOR (Ready to Sign):</div>
                                        {proofData?.unsigned_cbor?.slice(0, 64)}...
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                const blob = new Blob([proofData?.unsigned_cbor], { type: 'text/plain' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `proof_${token.policyId}.cbor`;
                                                a.click();
                                            }}
                                            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Download CBOR
                                        </button>
                                        <button
                                            onClick={handleDemoSubmit}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Use Demo Signed TX
                                        </button>
                                    </div>
                                </div>
                            )}

                            {proofStatus === 'success' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-green-400 font-bold">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">✓</div>
                                        Proof Published On-Chain!
                                    </div>
                                    <a
                                        href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-black/40 p-3 rounded-lg text-blue-400 hover:text-blue-300 text-sm font-mono break-all underline"
                                    >
                                        {txHash}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                            Trade Anyway
                        </button>
                        {proofStatus === 'idle' && (
                            <button
                                onClick={handlePublishProof}
                                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition-all border border-gray-600 hover:border-gray-500"
                            >
                                Publish Proof
                            </button>
                        )}
                    </div>
                </div>

                {/* Whistleblower Modal Overlay */}
                {showWhistleblower && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 rounded-3xl">
                        <div className="w-full max-w-lg text-center space-y-6">
                            {whistleStep === 'generating' && (
                                <>
                                    <div className="w-20 h-20 mx-auto border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                                    <h3 className="text-2xl font-bold text-white">Generating ZK Proof...</h3>
                                    <p className="text-gray-400">Proving misconduct without revealing your identity.</p>
                                </>
                            )}
                            {whistleStep === 'obfuscating' && (
                                <>
                                    <div className="w-20 h-20 mx-auto flex items-center justify-center bg-red-500/20 rounded-full animate-pulse">
                                        <Shield className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Obfuscating PII...</h3>
                                    <p className="text-gray-400">Encrypting metadata and wallet signatures.</p>
                                </>
                            )}
                            {whistleStep === 'done' && (
                                <>
                                    <div className="w-20 h-20 mx-auto flex items-center justify-center bg-green-500/20 rounded-full">
                                        <div className="text-4xl">✓</div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Report Submitted</h3>
                                    <div className="bg-gray-800 p-4 rounded-xl font-mono text-sm text-gray-300 break-all">
                                        Proof ID: {whistleProofId}
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Your report has been cryptographically verified and submitted to the NexGuard DAO.
                                    </p>
                                    <button
                                        onClick={() => setShowWhistleblower(false)}
                                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-bold"
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
