import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import DEXSimulator from '../components/DEXSimulator';

interface Token {
    tokenId: string;
    name: string;
    symbol: string;
    trust_score: number;
    riskProfile: string;
    flags: string[];
}

export default function TradePage() {
    const [memeCoins, setMemeCoins] = useState<Token[]>([]);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemeCoins();
    }, []);

    const fetchMemeCoins = async () => {
        try {
            const res = await axios.get(`${API_URL}/memecoins?limit=50`);
            setMemeCoins(res.data);
            if (res.data.length > 0 && !selectedToken) {
                setSelectedToken(res.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch meme coins:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">DEX Simulator</h1>
                    <p className="text-gray-400 text-lg">Trade meme coins with NexGuard risk protection</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Token Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-white mb-4">Select Token</h2>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {memeCoins.map((coin) => (
                                        <button
                                            key={coin.tokenId}
                                            onClick={() => setSelectedToken(coin)}
                                            className={`w-full text-left p-3 rounded-xl transition-all ${selectedToken?.tokenId === coin.tokenId
                                                    ? 'bg-blue-600 border-2 border-blue-500'
                                                    : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-white font-bold">{coin.name}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${coin.trust_score >= 75 ? 'bg-green-500/20 text-green-400' :
                                                        coin.trust_score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                                            coin.trust_score >= 25 ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {coin.trust_score}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-sm">{coin.symbol}</span>
                                                {coin.flags.length > 0 && (
                                                    <span className="text-red-400 text-xs">🚩 {coin.flags.length}</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DEX Simulator */}
                    <div className="lg:col-span-2">
                        <DEXSimulator token={selectedToken} />
                    </div>
                </div>
            </div>
        </div>
    );
}
