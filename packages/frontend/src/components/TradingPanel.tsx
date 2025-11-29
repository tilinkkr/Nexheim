import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Settings, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import API_URL from '../apiConfig';

export default function TradingPanel() {
    const { address, balance } = useWallet();
    const [amount, setAmount] = useState('');
    const [isBuy, setIsBuy] = useState(true);
    const [quote, setQuote] = useState<any>(null);
    const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'submitting' | 'success'>('idle');

    // Simulate Quote Fetching
    useEffect(() => {
        if (!amount || isNaN(Number(amount))) {
            setQuote(null);
            return;
        }

        const timer = setTimeout(() => {
            const val = Number(amount);
            const price = 1.25 + (Math.random() * 0.05);
            setQuote({
                output: isBuy ? (val / price).toFixed(2) : (val * price).toFixed(2),
                price: price.toFixed(4),
                fee: (val * 0.003).toFixed(4)
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [amount, isBuy]);

    const handleTrade = async () => {
        if (!address || !amount || !quote) return;

        setTxStatus('signing');
        // Simulate Wallet Signature
        await new Promise(r => setTimeout(r, 1500));

        setTxStatus('submitting');
        // Simulate Submission
        await new Promise(r => setTimeout(r, 2000));

        // Record trade in audit log
        try {
            const response = await fetch(`${API_URL}/trade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: 'TOKEN',
                    type: isBuy ? 'buy' : 'sell',
                    amount: parseFloat(amount),
                    trader: address // Link to wallet
                })
            });
            
            if (response.ok) {
                console.log('Trade recorded in audit log');
            }
        } catch (error) {
            console.error('Failed to record trade:', error);
        }

        setTxStatus('success');
        setTimeout(() => {
            setTxStatus('idle');
            setAmount('');
            setQuote(null);
        }, 3000);
    };

    return (
        <div className="bg-surface backdrop-blur-md border border-glass-outline rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {txStatus === 'success' && (
                <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                        <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Swap Successful!</h3>
                    <p className="text-green-300 font-mono text-sm">Tx: 8a3f...9c2d</p>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setIsBuy(true)}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${isBuy ? 'bg-neon text-black shadow-lg shadow-neon/20' : 'text-muted hover:text-white'}`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setIsBuy(false)}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${!isBuy ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'text-muted hover:text-white'}`}
                    >
                        Sell
                    </button>
                </div>
                <button className="text-muted hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {!address && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-yellow-400">
                            <AlertCircle size={20} />
                            <span className="font-medium">Connect your wallet to trade</span>
                        </div>
                        <p className="text-yellow-500 text-sm mt-1">Wallet connection required for secure trading simulation</p>
                    </div>
                )}
                
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 hover:border-glass-outline transition-colors">
                    <div className="flex justify-between text-xs text-muted mb-2">
                        <span>Pay</span>
                        <span className="flex items-center gap-1"><Wallet size={12} /> Balance: {balance ? `${balance} ADA` : '0.00 ADA'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent text-2xl font-mono font-bold text-white outline-none w-full"
                            disabled={!address}
                        />
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <img src="https://cryptologos.cc/logos/cardano-ada-logo.png" className="w-5 h-5" alt="ADA" />
                            <span className="font-bold text-sm">ADA</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <button className="bg-surface border border-glass-outline p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowDownUp size={16} className="text-neon" />
                    </button>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5 hover:border-glass-outline transition-colors">
                    <div className="flex justify-between text-xs text-muted mb-2">
                        <span>Receive (Estimated)</span>
                        <span>{quote ? `1 ${isBuy ? 'ADA' : 'TOKEN'} ≈ ${quote.price} ${isBuy ? 'TOKEN' : 'ADA'}` : '~ $0.00'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={quote ? quote.output : ''}
                            placeholder="0.00"
                            readOnly
                            className="bg-transparent text-2xl font-mono font-bold text-white outline-none w-full"
                        />
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                            <span className="font-bold text-sm">TOKEN</span>
                        </div>
                    </div>
                </div>

                {quote && (
                    <div className="text-xs text-slate-400 px-2 flex justify-between">
                        <span>Network Fee</span>
                        <span>{quote.fee} ADA</span>
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: address ? 1.02 : 1 }}
                    whileTap={{ scale: address ? 0.98 : 1 }}
                    onClick={handleTrade}
                    disabled={!address || !amount || !quote || txStatus !== 'idle'}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isBuy
                        ? 'bg-neon text-black shadow-neon/20 hover:shadow-neon/40'
                        : 'bg-danger text-white shadow-danger/20 hover:shadow-danger/40'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {!address ? 'Connect Wallet to Trade' : 
                     txStatus === 'idle' ? (isBuy ? 'Buy Token' : 'Sell Token') :
                     txStatus === 'signing' ? <><Loader2 className="animate-spin" /> Signing Transaction...</> :
                     txStatus === 'submitting' ? <><Loader2 className="animate-spin" /> Submitting to Chain...</> :
                     'Processing...'}
                </motion.button>
            </div>
        </div>
    );
}
