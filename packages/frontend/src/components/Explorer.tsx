import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Search, Siren, ThumbsUp, ThumbsDown, Lock, AlertTriangle } from 'lucide-react';
import ReportModal from './ReportModal';
import { useWallet } from '../context/WalletContext';
import API_URL from '../apiConfig';

interface ExplorerProps {
    onAskMasumi?: (coin: any) => void;
    onSelect?: (tokenId: string) => void;
}

const Explorer = ({ onAskMasumi, onSelect }: ExplorerProps) => {
    const { address } = useWallet();
    const [coins, setCoins] = useState<any[]>([]);
    const [reportingCoin, setReportingCoin] = useState<any>(null);
    const [votedTokens, setVotedTokens] = useState<Set<string>>(new Set());

    const fetchCoins = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/coins`);
            setCoins(prevCoins => {
                const newCoins = res.data.reverse();
                return newCoins.map((nc: any) => {
                    const existing = prevCoins.find(pc => pc.tokenId === nc.tokenId);
                    if (existing && existing.isCrashed) {
                        return existing; // Keep the crashed state
                    }
                    return nc;
                });
            });
        } catch (err) {
            console.error("Failed to fetch coins", err);
        }
    };

    useEffect(() => {
        fetchCoins();
        const interval = setInterval(fetchCoins, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleReportSubmit = async (riskType: string, evidence: string) => {
        if (!reportingCoin) return;

        // Require wallet connection
        if (!address) {
            alert('⚠️ Please connect your wallet to submit reports');
            setReportingCoin(null);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/whistle`, {
                tokenId: reportingCoin.tokenId,
                reportText: `${riskType}: ${evidence}`,
                reporterId: address // Use wallet address as reporter ID
            });

            if (res.data.penalty === 0) {
                alert("⚠️ Report Submitted! Token is now Under Review (High Report Volume).");
            } else {
                alert(`⚠️ Verified Whistleblower Report! Score reduced by ${res.data.penalty}.`);
            }

        } catch (e: any) {
            console.error("Backend report failed", e);
            if (e.response && e.response.data && e.response.data.error) {
                alert(`❌ Error: ${e.response.data.error}`);
                return;
            }
        }

        fetchCoins();
        setReportingCoin(null);
    };

    const handleVote = async (tokenId: string, voteType: string) => {
        // Require wallet connection
        if (!address) {
            alert('⚠️ Please connect your wallet to vote');
            return;
        }

        // Check if already voted (one vote per wallet per token)
        const voteKey = `${address}_${tokenId}`;
        if (votedTokens.has(voteKey)) {
            alert('⚠️ You have already voted on this token');
            return;
        }

        try {
            await axios.post(`${API_URL}/vote`, {
                tokenId,
                vote: voteType,
                voterId: address // Track voter by wallet address
            });

            // Mark as voted
            setVotedTokens(prev => new Set([...prev, voteKey]));
            fetchCoins();
        } catch (e) {
            console.error("Vote failed", e);
        }
    };

    const getTrustColor = (score: number) => {
        if (score > 70) return 'bg-green-500';
        if (score < 50) return 'bg-red-500';
        return 'bg-yellow-500';
    };

    const getRiskLevel = (coin: any) => {
        if (coin.isCrashed) return <span className="text-red-500 font-bold flex items-center gap-1"><Siren size={14} className="animate-pulse" /> CRITICAL</span>;
        if (coin.isUnderReview) return <span className="text-purple-400 font-bold flex items-center gap-1"><Lock size={14} /> UNDER REVIEW</span>;
        if (coin.isDisputed) return <span className="text-orange-500 font-bold flex items-center gap-1"><AlertTriangle size={14} /> DISPUTED</span>;
        if (coin.trust_score > 70) return <span className="text-green-500 font-bold">Safe</span>;
        if (coin.trust_score < 50) return <span className="text-red-500 font-bold">Critical</span>;
        return <span className="text-yellow-500 font-bold">Warning</span>;
    };

    const getMetrics = (token: any) => {
        const hash = token.tokenId.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        return {
            liquidity: `$${(hash * 12).toLocaleString()}`,
            mktCap: `$${(hash * 450).toLocaleString()}`,
            age: `${hash % 60}m ago`
        };
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl mt-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                            <th className="p-4 font-medium">Token</th>
                            <th className="p-4 font-medium">Risk Status</th>
                            <th className="p-4 text-right font-medium">Liquidity</th>
                            <th className="p-4 text-right font-medium">Mkt Cap</th>
                            <th className="p-4 text-right font-medium">Age</th>
                            <th className="p-4 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No tokens found.
                                </td>
                            </tr>
                        ) : (
                            coins.map((coin) => {
                                const metrics = getMetrics(coin);
                                return (
                                    <tr
                                        key={coin.tokenId}
                                        onClick={() => onSelect && onSelect(coin.tokenId)}
                                        className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTrustColor(coin.trust_score)} text-white shadow-lg`}>
                                                    {coin.trust_score}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-2">
                                                        {coin.name}
                                                        <span className="text-xs font-normal text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{coin.symbol}</span>
                                                        {coin.source === 'blockfrost' && (
                                                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded font-semibold">
                                                                🔗 LIVE
                                                            </span>
                                                        )}
                                                        {coin.source === 'meme_factory' && (
                                                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded font-semibold">
                                                                🎲 MEME
                                                            </span>
                                                        )}
                                                        {(coin.source === 'database' || coin.source === 'simulation') && (
                                                            <span className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded font-semibold">
                                                                🧪 SIM
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-mono">
                                                        {coin.policyId?.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getRiskLevel(coin)}
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-200 text-sm">
                                            {metrics.liquidity}
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-200 text-sm">
                                            {metrics.mktCap}
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-300 text-sm">
                                            {metrics.age}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVote(coin.tokenId, 'agree');
                                                    }}
                                                    disabled={!address || votedTokens.has(`${address}_${coin.tokenId}`)}
                                                    className="text-green-500 hover:bg-green-500/10 p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!address ? 'Connect wallet to vote' : votedTokens.has(`${address}_${coin.tokenId}`) ? 'Already voted' : 'Vote Safe'}
                                                >
                                                    <ThumbsUp size={14} />
                                                    <span className="text-[10px] ml-1">{coin.votes?.agree || 0}</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVote(coin.tokenId, 'disagree');
                                                    }}
                                                    disabled={!address || votedTokens.has(`${address}_${coin.tokenId}`)}
                                                    className="text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!address ? 'Connect wallet to vote' : votedTokens.has(`${address}_${coin.tokenId}`) ? 'Already voted' : 'Vote Suspicious'}
                                                >
                                                    <ThumbsDown size={14} />
                                                    <span className="text-[10px] ml-1">{coin.votes?.disagree || 0}</span>
                                                </button>
                                                <div className="w-px h-4 bg-gray-700 mx-1"></div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAskMasumi && onAskMasumi(coin);
                                                    }}
                                                    className="text-xs font-bold text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 px-3 py-1.5 rounded transition-all flex items-center gap-1"
                                                    title="Ask Masumi AI"
                                                >
                                                    🤖 Ask AI
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setReportingCoin(coin);
                                                    }}
                                                    disabled={!address}
                                                    className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 bg-red-500/10 px-3 py-1.5 rounded transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!address ? 'Connect wallet to report' : 'Submit Report'}
                                                >
                                                    🚨 Report
                                                    {coin.reportCount > 0 && (
                                                        <span className="bg-red-500 text-white text-[9px] px-1 rounded-full ml-1">{coin.reportCount}</span>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <ReportModal
                isOpen={!!reportingCoin}
                onClose={() => setReportingCoin(null)}
                onSubmit={handleReportSubmit}
                coinName={reportingCoin?.name}
            />
        </div>
    );
};

export default Explorer;
