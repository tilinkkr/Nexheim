import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Search, Siren, ThumbsUp, ThumbsDown, AlertTriangle, Target, Shield, Zap } from 'lucide-react';
import ReportModal from './ReportModal';
import { useWallet } from '../context/WalletContext';
import API_URL from '../apiConfig';

interface ExplorerProps {
    onAskMasumi?: (coin: any) => void;
    onSelect?: (tokenId: string) => void;
    onTokenClick?: (policyId: string) => void;
}

const Explorer = ({ onAskMasumi, onSelect, onTokenClick }: ExplorerProps) => {
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
                const newCoins = res.data; // Backend sends newest first (real tokens, then new memes)
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

    // Helper component for individual token cards to manage price flash state
    const TokenCard = ({ coin }: { coin: any }) => {
        const [flashClass, setFlashClass] = useState('');
        const [prevPrice, setPrevPrice] = useState(coin.price);

        useEffect(() => {
            if (coin.price !== prevPrice) {
                const isUp = parseFloat(coin.price) > parseFloat(prevPrice);
                setFlashClass(isUp ? 'flash-green' : 'flash-red');
                setPrevPrice(coin.price);
                const timer = setTimeout(() => setFlashClass(''), 1000);
                return () => clearTimeout(timer);
            }
        }, [coin.price, prevPrice]);

        return (
            <div className={`glass-card p-4 rounded-xl relative overflow-hidden group ${flashClass}`}>
                <div className="flex items-start">


                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-base truncate">{coin.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTrustColor(coin.trust_score)}`}>
                                {coin.trust_score}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400 font-mono bg-white/5 px-1.5 rounded">{coin.symbol}</span>
                            {coin.isCrashed && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded-full flex items-center gap-1">
                                    <AlertTriangle size={8} /> CRASHED
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <div className="text-xs text-gray-400 mb-0.5">Price</div>
                        <div className="text-lg font-bold text-white tracking-tight">
                            ${parseFloat(coin.price || '0').toFixed(4)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 mb-0.5">24h Change</div>
                        <div className={`text-sm font-bold flex items-center justify-end gap-1 ${parseFloat(coin.priceChange24h) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {parseFloat(coin.priceChange24h) >= 0 ? <Activity size={12} /> : <Activity size={12} className="rotate-180" />}
                            {parseFloat(coin.priceChange24h) >= 0 ? '+' : ''}{coin.priceChange24h}%
                        </div>
                    </div>
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => handleVote(coin.tokenId, 'agree', e)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-green-500/20 text-white hover:text-green-400 transition-colors backdrop-blur-sm"
                        >
                            <ThumbsUp size={14} />
                        </button>
                        <button
                            onClick={(e) => handleVote(coin.tokenId, 'disagree', e)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors backdrop-blur-sm"
                        >
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onAskMasumi && onAskMasumi(coin); }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <Zap size={12} /> Analyze
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setReportingCoin(coin); }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors backdrop-blur-sm"
                        >
                            <Siren size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0 relative z-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-heading">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Target className="w-6 h-6 text-blue-400" />
                        </div>
                        Token Explorer
                    </h2>
                    <p className="text-sm text-gray-400 mt-2 ml-1">Real-time AI risk analysis & market intelligence</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Shield size={14} />
                            <span className="font-bold">{safeCount}</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={14} />
                            <span className="font-bold">{riskyCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 overflow-hidden max-w-[240px]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                            <Activity className="w-4 h-4 text-blue-400 relative z-10" />
                        </div>
                        <div className="flex flex-col h-6 overflow-hidden w-full">
                            <div className="animate-slide-up w-full">
                                {coins.filter(c => c.trust_score < 50).slice(0, 3).map((c, i) => (
                                    <span key={c.tokenId || i} className="block text-xs font-medium text-white whitespace-nowrap truncate leading-6">
                                        ⚠️ <span className="font-bold text-red-400">{c.symbol}</span>: High Risk Detected
                                    </span>
                                ))}
                                {coins.filter(c => c.trust_score < 50).length === 0 && (
                                    <span className="block text-xs font-medium text-emerald-400 leading-6">System Secure • No Threats</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex items-center gap-4 mb-8 shrink-0 relative z-10">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tokens by name or symbol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0A0B10] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#0F1118] transition-all relative z-10"
                    />
                </div>
                <div className="flex items-center gap-1 bg-[#0A0B10] border border-white/10 rounded-xl p-1.5">
                    {['all', 'safe', 'risky'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${filter === f
                                ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent min-h-0 relative z-10">
                {filteredCoins.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <div className="p-6 rounded-full bg-white/5 mb-4">
                            <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium">No tokens found</p>
                        <p className="text-sm opacity-60 mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
                        {filteredCoins.map((coin) => {
                            if (!coin) return null;
                            return <TokenCard key={coin.tokenId ?? coin.policyId ?? coin.symbol} coin={coin} />;
                        })}
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={!!reportingCoin}
                onClose={() => setReportingCoin(null)}
                onSubmit={(type, evidence) => {
                    console.log("Report:", type, evidence);
                    setReportingCoin(null);
                }}
                coinName={reportingCoin?.name}
            />
        </div>
    );
};

export default Explorer;
