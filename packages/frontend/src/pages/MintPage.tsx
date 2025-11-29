import { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { useWallet } from '../context/WalletContext';

const MintPage = () => {
    const { address, walletApi } = useWallet();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [result, setResult] = useState<any>(null);
    const [signing, setSigning] = useState(false);

    const handleMint = async () => {
        if (!address) {
            alert('Please connect your wallet first to mint tokens');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/simulate/mint`, {
                name,
                symbol,
                creator: address
            });
            setResult(res.data);

            // Note: Wallet signing removed to avoid CBOR deserialization errors
            // In production, this would use a properly formatted transaction
        } catch (err) {
            console.error('Mint error:', err);
            alert("Mint failed. Please check the console for details.");
        }
    };

    const handleSignTransaction = async (tokenId: string) => {
        if (!walletApi) return;

        setSigning(true);
        try {
            const dummyTxHex = '84a400818258200000000000000000000000000000000000000000000000000000000000000000000182825839000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a000f4240a0f5f6';

            console.log('Requesting transaction signature...');
            const signedTx = await walletApi.signTx(dummyTxHex, false);
            console.log('Transaction signed:', signedTx);

            alert('✅ Demo transaction signed successfully!\n\nIn a real app, this would be submitted to the blockchain.');
        } catch (error: any) {
            console.error('Signing failed:', error);
            if (error.code === 2) {
                alert('Transaction signing was cancelled by user');
            } else {
                alert(`Signing failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setSigning(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Token Launchpad</h1>
                    <p className="text-gray-400 text-lg">Simulate minting tokens on Cardano testnet</p>
                </div>

                {!address && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-yellow-200 font-medium">Connect your wallet to start minting</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mint Form */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Token
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Token Name</label>
                                <input
                                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="e.g., My Awesome Token"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={!address}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Symbol</label>
                                <input
                                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase"
                                    placeholder="e.g., MAT"
                                    value={symbol}
                                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                                    disabled={!address}
                                    maxLength={5}
                                />
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                onClick={handleMint}
                                disabled={!address || signing || !name || !symbol}
                            >
                                {signing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing Transaction...
                                    </span>
                                ) : address ? 'Launch Token' : 'Connect Wallet First'}
                            </button>
                        </div>
                    </div>

                    {/* Success Result or Guide */}
                    {result ? (
                        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-green-400">Token Created!</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1">Token ID</p>
                                    <p className="text-white font-mono text-sm break-all">{result.tokenId}</p>
                                </div>

                                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1">Trust Score</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                                                style={{ width: `${result.trust_score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold text-lg">{result.trust_score}/100</span>
                                    </div>
                                </div>

                                <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1">Creator</p>
                                    <p className="text-gray-300 font-mono text-sm">{address?.slice(0, 20)}...{address?.slice(-12)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setResult(null)}
                                className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
                            >
                                Mint Another Token
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
                            <div className="space-y-4 text-gray-400">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">1</div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Connect Wallet</p>
                                        <p className="text-sm">Link your Cardano wallet to sign transactions</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">2</div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Enter Details</p>
                                        <p className="text-sm">Provide a name and symbol for your token</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">3</div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Sign Transaction</p>
                                        <p className="text-sm">Approve the demo transaction in your wallet</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">4</div>
                                    <div>
                                        <p className="font-semibold text-white mb-1">Token Created</p>
                                        <p className="text-sm">Your token is simulated and ready to test</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MintPage;
