import { useState } from 'react';

interface Token {
    tokenId: string;
    name: string;
    symbol: string;
    trust_score: number;
    riskProfile: string;
    flags: string[];
}

interface DEXSimulatorProps {
    token: Token | null;
}

export default function DEXSimulator({ token }: DEXSimulatorProps) {
    const [amount, setAmount] = useState('');
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [showWarning, setShowWarning] = useState(false);
    const [trades, setTrades] = useState<any[]>([]);

    const price = token ? (0.5 + Math.random() * 2).toFixed(4) : '0';
    const totalAda = amount ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0';

    const handleTrade = () => {
        if (!token || !amount) return;

        // Show warning for risky tokens
        if (token.trust_score < 50 && tradeType === 'buy') {
            setShowWarning(true);
            return;
        }

        executeTrade();
    };

    const executeTrade = () => {
        if (!token || !amount) return;

        const trade = {
            id: Date.now(),
            type: tradeType,
            token: token.name,
            symbol: token.symbol,
            amount: parseFloat(amount),
            price: parseFloat(price),
            total: parseFloat(totalAda),
            timestamp: new Date().toLocaleTimeString()
        };

        setTrades([trade, ...trades]);
        setAmount('');
        setShowWarning(false);
    };

    const proceedAnyway = () => {
        executeTrade();
    };

    if (!token) {
        return (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-gray-400 text-lg">Select a token to start trading</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-red-500 mb-2">⚠️ HIGH RISK WARNING</h2>
                            <p className="text-gray-300 mb-4">NexGuard has detected significant risks with this token</p>
                        </div>

                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400">Trust Score</span>
                                <span className="text-red-400 font-bold text-xl">{token.trust_score}/100</span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400">Risk Profile</span>
                                <span className="text-red-400 font-bold uppercase">{token.riskProfile}</span>
                            </div>
                            {token.flags.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <p className="text-gray-400 text-sm mb-2">Detected Flags:</p>
                                    <div className="space-y-1">
                                        {token.flags.map((flag, i) => (
                                            <div key={i} className="flex items-center gap-2 text-red-400 text-sm">
                                                <span>🚩</span>
                                                <span>{flag.replace(/_/g, ' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowWarning(false)}
                                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Cancel Trade
                            </button>
                            <button
                                onClick={proceedAnyway}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors"
                            >
                                Proceed Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trade Interface */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Trade {token.name}</h2>

                {/* Buy/Sell Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setTradeType('buy')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-colors ${tradeType === 'buy'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setTradeType('sell')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-colors ${tradeType === 'sell'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Sell
                    </button>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2">Amount ({token.symbol})</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-xl focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Price Info */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price per {token.symbol}</span>
                        <span className="text-white font-bold">{price} ADA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total</span>
                        <span className="text-white font-bold">{totalAda} ADA</span>
                    </div>
                </div>

                {/* Trust Score Warning */}
                {token.trust_score < 75 && (
                    <div className={`p-4 rounded-xl mb-6 ${token.trust_score < 25 ? 'bg-red-900/20 border border-red-500/30' :
                            token.trust_score < 50 ? 'bg-orange-900/20 border border-orange-500/30' :
                                'bg-yellow-900/20 border border-yellow-500/30'
                        }`}>
                        <div className="flex items-center gap-3">
                            <svg className={`w-6 h-6 ${token.trust_score < 25 ? 'text-red-500' :
                                    token.trust_score < 50 ? 'text-orange-500' :
                                        'text-yellow-500'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className={`font-bold ${token.trust_score < 25 ? 'text-red-400' :
                                        token.trust_score < 50 ? 'text-orange-400' :
                                            'text-yellow-400'
                                    }`}>
                                    Trust Score: {token.trust_score}/100
                                </p>
                                <p className="text-gray-400 text-sm">NexGuard recommends caution</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trade Button */}
                <button
                    onClick={handleTrade}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${tradeType === 'buy'
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {token.symbol}
                </button>
            </div>

            {/* Trade History */}
            {trades.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>
                    <div className="space-y-2">
                        {trades.map((trade) => (
                            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                <div>
                                    <span className={`font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.type.toUpperCase()}
                                    </span>
                                    <span className="text-gray-400 ml-2">{trade.amount} {trade.symbol}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{trade.total} ADA</p>
                                    <p className="text-gray-500 text-xs">{trade.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
