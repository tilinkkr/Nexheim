import { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { Coins, Lock, Users, Image, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const MintPage = () => {
    const { address, walletApi } = useWallet();

    // Basic Info
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Token Economics
    const [initialSupply, setInitialSupply] = useState('1000000');
    const [decimals, setDecimals] = useState('6');
    const [liquidityADA, setLiquidityADA] = useState('100');

    // Distribution
    const [creatorAllocation, setCreatorAllocation] = useState('20');
    const [liquidityAllocation, setLiquidityAllocation] = useState('50');
    const [communityAllocation, setCommunityAllocation] = useState('30');

    // Security
    const [lockPeriod, setLockPeriod] = useState('30');
    const [mintable, setMintable] = useState(false);

    const [result, setResult] = useState<any>(null);
    const [signing, setSigning] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'economics' | 'distribution' | 'security'>('basic');

    const totalAllocation = Number(creatorAllocation) + Number(liquidityAllocation) + Number(communityAllocation);
    const isAllocationValid = totalAllocation === 100;

    const handleMint = async () => {
        if (!address) {
            alert('Please connect your wallet first to mint tokens');
            return;
        }

        if (!isAllocationValid) {
            alert('Token distribution must total 100%');
            return;
        }

        try {
            setSigning(true);
            const res = await axios.post(`${API_URL}/simulate/mint`, {
                name,
                symbol,
                description,
                imageUrl,
                initialSupply: Number(initialSupply),
                decimals: Number(decimals),
                liquidityADA: Number(liquidityADA),
                distribution: {
                    creator: Number(creatorAllocation),
                    liquidity: Number(liquidityAllocation),
                    community: Number(communityAllocation)
                },
                security: {
                    lockPeriod: Number(lockPeriod),
                    mintable
                },
                creator: address
            });
            setResult(res.data);
        } catch (err) {
            console.error('Mint error:', err);
            alert("Mint failed. Please check the console for details.");
        } finally {
            setSigning(false);
        }
    };

    const renderBasicTab = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Token Name *
                </label>
                <input
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="e.g., MoonDoge"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={!address}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Symbol *</label>
                <input
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase"
                    placeholder="e.g., MDOGE"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    disabled={!address}
                    maxLength={5}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                </label>
                <textarea
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Describe your meme coin..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    disabled={!address}
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Image URL
                </label>
                <input
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="https://example.com/token-logo.png"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    disabled={!address}
                />
            </div>
        </div>
    );

    const renderEconomicsTab = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Initial Supply *
                </label>
                <input
                    type="number"
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="1000000"
                    value={initialSupply}
                    onChange={e => setInitialSupply(e.target.value)}
                    disabled={!address}
                    min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Total tokens to mint</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Decimals *</label>
                <select
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={decimals}
                    onChange={e => setDecimals(e.target.value)}
                    disabled={!address}
                >
                    <option value="0">0 (No decimals)</option>
                    <option value="6">6 (Standard)</option>
                    <option value="8">8 (High precision)</option>
                    <option value="18">18 (ERC-20 style)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Number of decimal places</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-400" />
                    Initial Liquidity (ADA) *
                </label>
                <input
                    type="number"
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="100"
                    value={liquidityADA}
                    onChange={e => setLiquidityADA(e.target.value)}
                    disabled={!address}
                    min="10"
                />
                <p className="text-xs text-gray-500 mt-1">ADA to pair with tokens for initial liquidity</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-300">
                        <p className="font-semibold mb-1">Initial Price Calculation</p>
                        <p className="text-blue-400">
                            Price per token: ~{(Number(liquidityADA) / (Number(initialSupply) * Number(liquidityAllocation) / 100)).toFixed(8)} ADA
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDistributionTab = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Creator Allocation (%)
                </label>
                <input
                    type="number"
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="20"
                    value={creatorAllocation}
                    onChange={e => setCreatorAllocation(e.target.value)}
                    disabled={!address}
                    min="0"
                    max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Tokens: {((Number(initialSupply) * Number(creatorAllocation)) / 100).toLocaleString()}
                </p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Liquidity Pool (%)</label>
                <input
                    type="number"
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="50"
                    value={liquidityAllocation}
                    onChange={e => setLiquidityAllocation(e.target.value)}
                    disabled={!address}
                    min="0"
                    max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Tokens: {((Number(initialSupply) * Number(liquidityAllocation)) / 100).toLocaleString()}
                </p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Community/Airdrop (%)</label>
                <input
                    type="number"
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="30"
                    value={communityAllocation}
                    onChange={e => setCommunityAllocation(e.target.value)}
                    disabled={!address}
                    min="0"
                    max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Tokens: {((Number(initialSupply) * Number(communityAllocation)) / 100).toLocaleString()}
                </p>
            </div>

            <div className={`rounded-xl p-4 border ${isAllocationValid ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isAllocationValid ? 'text-green-400' : 'text-red-400'}`}>
                        Total Allocation
                    </span>
                    <span className={`text-2xl font-bold ${isAllocationValid ? 'text-green-400' : 'text-red-400'}`}>
                        {totalAllocation}%
                    </span>
                </div>
                {!isAllocationValid && (
                    <p className="text-xs text-red-400 mt-2">Must equal 100%</p>
                )}
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Liquidity Lock Period (Days)
                </label>
                <select
                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={lockPeriod}
                    onChange={e => setLockPeriod(e.target.value)}
                    disabled={!address}
                >
                    <option value="0">No Lock (High Risk)</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days (Recommended)</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="365">1 Year</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    Prevents removing liquidity for {lockPeriod} days
                </p>
            </div>

            <div className="bg-gray-950/50 border border-gray-700 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="font-semibold text-white">Mintable Token</p>
                        <p className="text-xs text-gray-400 mt-1">Allow minting additional tokens after launch</p>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={mintable}
                            onChange={e => setMintable(e.target.checked)}
                            disabled={!address}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500/20 transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                </label>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-300">
                        <p className="font-semibold mb-1">Security Recommendations</p>
                        <ul className="text-yellow-400 space-y-1 text-xs">
                            <li>• Lock liquidity for at least 30 days</li>
                            <li>• Disable minting for fixed supply</li>
                            <li>• Allocate majority to liquidity pool</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Token Launchpad</h1>
                    <p className="text-gray-400 text-lg">Create and launch your meme coin on Cardano</p>
                </div>

                {!address && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <p className="text-yellow-200 font-medium">Connect your wallet to start minting</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mint Form */}
                    <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Coins className="w-6 h-6 text-blue-400" />
                            Create New Token
                        </h2>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            {[
                                { id: 'basic', label: 'Basic Info' },
                                { id: 'economics', label: 'Economics' },
                                { id: 'distribution', label: 'Distribution' },
                                { id: 'security', label: 'Security' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {activeTab === 'basic' && renderBasicTab()}
                            {activeTab === 'economics' && renderEconomicsTab()}
                            {activeTab === 'distribution' && renderDistributionTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                        </div>

                        {/* Launch Button */}
                        <motion.button
                            whileHover={{ scale: address ? 1.02 : 1 }}
                            whileTap={{ scale: address ? 0.98 : 1 }}
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                            onClick={handleMint}
                            disabled={!address || signing || !name || !symbol || !isAllocationValid}
                        >
                            {signing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Token...
                                </>
                            ) : address ? (
                                <>
                                    <Coins className="w-5 h-5" />
                                    Launch Token
                                </>
                            ) : (
                                'Connect Wallet First'
                            )}
                        </motion.button>
                    </div>

                    {/* Success Result or Summary */}
                    <div className="lg:col-span-1">
                        {result ? (
                            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 shadow-2xl sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-green-400">Token Created!</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-gray-950/50 rounded-xl p-3 border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Token ID</p>
                                        <p className="text-white font-mono text-xs break-all">{result.tokenId}</p>
                                    </div>

                                    <div className="bg-gray-950/50 rounded-xl p-3 border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Trust Score</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                                                    style={{ width: `${result.trust_score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white font-bold text-sm">{result.trust_score}/100</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                                >
                                    Mint Another Token
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sticky top-8">
                                <h3 className="text-lg font-bold text-white mb-4">Token Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Supply:</span>
                                        <span className="text-white font-semibold">{Number(initialSupply).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Liquidity:</span>
                                        <span className="text-white font-semibold">{liquidityADA} ADA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Lock Period:</span>
                                        <span className="text-white font-semibold">{lockPeriod} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Mintable:</span>
                                        <span className={mintable ? 'text-yellow-400' : 'text-green-400'}>{mintable ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 mb-2">Distribution</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Creator:</span>
                                            <span className="text-white">{creatorAllocation}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Liquidity:</span>
                                            <span className="text-white">{liquidityAllocation}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Community:</span>
                                            <span className="text-white">{communityAllocation}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MintPage;
