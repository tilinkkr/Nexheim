import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Search, Siren, ThumbsUp, ThumbsDown, Lock, AlertTriangle, Target, Shield, Zap, Filter } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, safe, risky

    const fetchCoins = async () => {
        try {
            const res = await axios.get(`${API_URL}/explorer`);
            setCoins(prevCoins => {
                const newCoins = res.data.reverse();
                return newCoins.map((nc: any) => {
                    const existing = prevCoins.find(pc => pc.tokenId === nc.tokenId);
                    if (existing && existing.isCrashed) {
                        return existing;
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

    const handleVote = async (tokenId: string, voteType: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!address) {
            alert('⚠️ Please connect your wallet to vote');
            return;
        }
        const voteKey = `${address}_${tokenId}`;
        if (votedTokens.has(voteKey)) {
            alert('⚠️ You have already voted on this token');
            return;
        }
        try {
            await axios.post(`${API_URL}/vote`, { tokenId, vote: voteType, voterId: address });
            setVotedTokens(prev => new Set([...prev, voteKey]));
            fetchCoins();
        } catch (e) {
            console.error("Vote failed", e);
        }
    };

    const getTrustColor = (score: number) => {
        if (score >= 75) return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (score >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        return 'text-red-400 bg-red-400/10 border-red-400/20';
    };

    const filteredCoins = coins.filter(coin => {
        const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'safe' && coin.trust_score >= 70) ||
            (filter === 'risky' && coin.trust_score < 50);
        return matchesSearch && matchesFilter;
    });

    const safeCount = coins.filter(c => c.trust_score >= 70).length;
    const riskyCount = coins.filter(c => c.trust_score < 50).length;

    return (
        <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-6 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-white tracking-wide flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-400" />
                        Token Explorer
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Real-time risk analysis across the ecosystem</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="font-medium">{safeCount} Safe</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-300 border border-red-400/20 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="font-medium">{riskyCount} Risky</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span className="font-medium">Live Feed</span>
                    </span>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search tokens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 border border-white/10 rounded-xl p-1">
                    {['all', 'safe', 'risky'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent min-h-0">
                {filteredCoins.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p>No tokens found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                        {filteredCoins.map((coin) => {
                            const hash = coin.tokenId.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
                            const liquidity = (hash * 12).toLocaleString();
                            const mktCap = (hash * 450).toLocaleString();

                            return (
                                <div
                                    key={coin.tokenId}
                                    onClick={() => onSelect && onSelect(coin.tokenId)}
                                    className="group relative bg-[#0A0A12] hover:bg-[#0F0F1A] border border-white/5 hover:border-blue-500/30 rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col gap-4"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border ${getTrustColor(coin.trust_score)} shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                                                {coin.trust_score}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm truncate max-w-[100px]">{coin.name}</h3>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-gray-400 font-mono">{coin.symbol}</span>
                                                    {coin.isCrashed && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">CRASHED</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coin.trust_score >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    coin.trust_score < 50 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {coin.trust_score >= 70 ? 'SAFE' : coin.trust_score < 50 ? 'RISKY' : 'WARN'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Liquidity</p>
                                            <p className="text-xs font-mono text-gray-300">${liquidity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mkt Cap</p>
                                            <p className="text-xs font-mono text-gray-300">${mktCap}</p>
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => handleVote(coin.tokenId, 'agree', e)}
                                                className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-500 hover:text-green-400 transition-colors"
                                            >
                                                <ThumbsUp size={14} />
                                            </button>
                                            <span className="text-[10px] text-gray-500 font-mono">{coin.votes?.agree || 0}</span>

                                            <button
                                                onClick={(e) => handleVote(coin.tokenId, 'disagree', e)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors ml-1"
                                            >
                                                <ThumbsDown size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAskMasumi && onAskMasumi(coin); }}
                                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                                                title="Ask AI"
                                            >
                                                <Zap size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setReportingCoin(coin); }}
                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                                title="Report"
                                            >
                                                <Siren size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={!!reportingCoin}
                onClose={() => setReportingCoin(null)}
                onSubmit={(type, evidence) => {
                    // Re-implement report logic here if needed, or pass to parent
                    console.log("Report:", type, evidence);
                    setReportingCoin(null);
                }}
                coinName={reportingCoin?.name}
            />
        </div>
    );
};

export default Explorer;
