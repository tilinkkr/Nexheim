import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import TokenAnalysisModal from './TokenAnalysisModal';

interface MemeCoin {
    id: string;
    tokenId?: string;
    name: string;
    symbol: string;
    trustScore: number;
    trust_score?: number;
    riskLevel: string;
    riskProfile?: string;
    flags: string[];
    createdAt: string;
    created_at?: string;
    priceChange24h?: string | number;
    rugProbability?: {
        percentage: number;
        label: string;
        emoji: string;
        color: string;
        severity: string;
    };
}

export default function LiveTokenFeed() {
    const [coins, setCoins] = useState<MemeCoin[]>([]);
    const [newCoinAlert, setNewCoinAlert] = useState<MemeCoin | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState(Date.now());
    const [selectedToken, setSelectedToken] = useState<MemeCoin | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const isDemo = window.location.search.includes('demo=true');
        setIsDemoMode(isDemo);

        if (isDemo) {
            runDemoScenario();
        } else {
            fetchCoins();
            const interval = setInterval(fetchCoins, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    const runDemoScenario = () => {
        console.log('🚀 Starting Demo Scenario...');

        // Initial State
        const initialCoins: MemeCoin[] = [
            { id: 'demo-1', name: 'SafeMoon 3.0', symbol: 'SAFE3', trustScore: 88, riskLevel: 'safe', priceChange24h: 15.2, flags: [], createdAt: new Date().toISOString() },
            { id: 'demo-2', name: 'PepeAI', symbol: 'PEPEAI', trustScore: 65, riskLevel: 'medium', priceChange24h: 5.4, flags: [], createdAt: new Date(Date.now() - 100000).toISOString() },
            { id: 'demo-3', name: 'ElonMuskCat', symbol: 'ELONCAT', trustScore: 42, riskLevel: 'risky', priceChange24h: -12.5, flags: ['Low Liquidity'], createdAt: new Date(Date.now() - 200000).toISOString() },
        ];
        setCoins(initialCoins);

        // Scenario Events
        const events = [
            {
                delay: 3000,
                action: () => {
                    const newCoin: MemeCoin = {
                        id: 'demo-attack', name: 'SuperGem', symbol: 'GEM',
                        trustScore: 95, riskLevel: 'safe', priceChange24h: 0, flags: [],
                        createdAt: new Date().toISOString()
                    };
                    setNewCoinAlert(newCoin);
                    setCoins(prev => [newCoin, ...prev]);
                    setTimeout(() => setNewCoinAlert(null), 5000);
                }
            },
            {
                delay: 8000,
                action: () => {
                    setCoins(prev => prev.map(c =>
                        c.id === 'demo-attack' ? { ...c, priceChange24h: 50.5, trustScore: 92 } : c
                    ));
                }
            },
            {
                delay: 12000,
                action: () => {
                    // Whale Dump Alert
                    setCoins(prev => prev.map(c =>
                        c.id === 'demo-attack' ? {
                            ...c,
                            priceChange24h: -40.2,
                            trustScore: 30,
                            riskLevel: 'risky',
                            flags: ['Whale Dump Detected']
                        } : c
                    ));
                }
            },
            {
                delay: 16000,
                action: () => {
                    // Rug Pull Confirmed
                    setCoins(prev => prev.map(c =>
                        c.id === 'demo-attack' ? {
                            ...c,
                            priceChange24h: -99.9,
                            trustScore: 5,
                            riskLevel: 'scam',
                            flags: ['Whale Dump Detected', 'Liquidity Removed'],
                            rugProbability: { percentage: 99, label: 'RUG PULL', emoji: '💀', color: 'red', severity: 'critical' }
                        } : c
                    ));
                }
            }
        ];

        events.forEach(event => setTimeout(event.action, event.delay));
    };

    const fetchCoins = async () => {
        try {
            const res = await axios.get(`${API_URL}/memecoins?limit=20`);
            const newCoins = res.data;

            if (coins.length > 0 && newCoins.length > 0) {
                const latestCoin = newCoins[0];
                const latestId = latestCoin.id || latestCoin.tokenId;
                const isNew = !coins.some(c => (c.id || c.tokenId) === latestId);

                if (isNew) {
                    setNewCoinAlert(latestCoin);
                    setTimeout(() => setNewCoinAlert(null), 5000);
                }
            }

            setCoins(newCoins);
            setLastFetchTime(Date.now());
        } catch (err) {
            console.error('Failed to fetch meme coins:', err);
        }
    };

    const getTrustColor = (score: number) => {
        if (score >= 75) return 'from-green-500 to-emerald-600';
        if (score >= 50) return 'from-yellow-500 to-amber-600';
        if (score >= 25) return 'from-orange-500 to-red-600';
        return 'from-red-600 to-rose-700';
    };

    const getTrustBorderColor = (score: number) => {
        if (score >= 75) return 'border-green-500/50 shadow-green-500/20';
        if (score >= 50) return 'border-yellow-500/50 shadow-yellow-500/20';
        if (score >= 25) return 'border-orange-500/50 shadow-orange-500/20';
        return 'border-red-500/50 shadow-red-500/20';
    };

    const getRiskBadge = (profile: string) => {
        const badges = {
            safe: {
                label: '✓ SAFE',
                color: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/50',
                icon: Shield
            },
            medium: {
                label: '⚡ MEDIUM',
                color: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/50',
                icon: TrendingUp
            },
            risky: {
                label: '⚠ RISKY',
                color: 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/50',
                icon: AlertTriangle
            },
            scam: {
                label: '🚨 SCAM',
                color: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/50',
                icon: AlertTriangle
            }
        };
        return badges[profile as keyof typeof badges] || badges.medium;
    };

    return (
        <div className="relative">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-black/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                                Live Token Feed {isDemoMode && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/50 ml-2">DEMO MODE</span>}
                            </h2>
                            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                        </div>
                        <p className="text-gray-400 text-sm ml-6">Real-time meme coin detection</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Last update</div>
                        <div className="text-sm font-mono text-blue-400">
                            {Math.floor((Date.now() - lastFetchTime) / 1000)}s ago
                        </div>
                    </div>
                </div>

                {/* New Coin Alert */}
                {newCoinAlert && (
                    <div className="mb-6 relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
                        <div className="relative p-5 border border-blue-500/50 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                                        <Sparkles className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-bounce"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-blue-400 font-bold text-sm mb-1">🎉 New Token Detected!</p>
                                    <p className="text-white text-xl font-bold">{newCoinAlert.name}</p>
                                    <p className="text-gray-400 text-sm">({newCoinAlert.symbol})</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl border-2 font-bold text-lg shadow-lg bg-gradient-to-r ${getTrustColor((newCoinAlert.trustScore ?? newCoinAlert.trust_score) ?? 0)} ${getTrustBorderColor((newCoinAlert.trustScore ?? newCoinAlert.trust_score) ?? 0)}`}>
                                    <div className="text-white drop-shadow-lg">
                                        {(newCoinAlert.trustScore ?? newCoinAlert.trust_score) ?? 0}
                                    </div>
                                    <div className="text-xs text-white/80">/ 100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Token List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {coins.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">Waiting for new tokens...</p>
                            <p className="text-gray-600 text-sm mt-2">Meme factory generates coins every 30s</p>
                        </div>
                    ) : (
                        coins.map((coin, index) => {
                            const badge = getRiskBadge(coin.riskLevel || coin.riskProfile || 'medium');
                            const trustScore = (coin.trustScore ?? coin.trust_score) ?? 0;
                            const priceChange = parseFloat(String(coin.priceChange24h || 0));
                            const Icon = badge.icon;

                            return (
                                <div
                                    key={coin.id || coin.tokenId || index}
                                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${index === 0 ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''
                                        }`}
                                >
                                    {/* Card Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Content */}
                                    <div className="relative p-4 border border-gray-700/50 group-hover:border-gray-600/80 transition-colors">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Left: Token Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-white font-bold text-lg truncate">{coin.name}</h3>
                                                    <span className="text-gray-500 text-sm font-mono">({coin.symbol})</span>
                                                    {index === 0 && (
                                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/50 animate-pulse">
                                                            LATEST
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {/* Risk Badge */}
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-xs ${badge.color} shadow-lg`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {badge.label}
                                                    </span>

                                                    {/* Time */}
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {new Date(coin.createdAt || coin.created_at || Date.now()).toLocaleTimeString()}
                                                    </span>

                                                    {/* Price Change */}
                                                    {priceChange !== 0 && (
                                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${priceChange > 0 ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {priceChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                            {priceChange > 0 ? '+' : ''}{priceChange}%
                                                        </span>
                                                    )}

                                                    {/* Flags */}
                                                    {coin.flags.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/30">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {coin.flags.length} flag{coin.flags.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Trust Score & Action */}
                                            <div className="flex items-center gap-3">
                                                {/* Trust Score */}
                                                <div className="text-center">
                                                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${getTrustColor(trustScore)} p-0.5 shadow-lg ${getTrustBorderColor(trustScore)}`}>
                                                        <div className="w-full h-full bg-gray-900 rounded-2xl flex flex-col items-center justify-center">
                                                            <div className="text-2xl font-bold text-white drop-shadow-lg">
                                                                {trustScore}
                                                            </div>
                                                            <div className="text-xs text-gray-400">/ 100</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Analyze Button */}
                                                <button
                                                    onClick={() => setSelectedToken(coin)}
                                                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
                                                >
                                                    Analyze
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Stats */}
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>{coins.length} tokens detected</span>
                        </div>
                        <div className="text-gray-500 font-mono">
                            Auto-refresh: 5s
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Modal */}
            {selectedToken && (
                <TokenAnalysisModal
                    token={selectedToken}
                    onClose={() => setSelectedToken(null)}
                />
            )}
        </div>
    );
}
