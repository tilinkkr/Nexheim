import { useState, useEffect } from 'react';
import LiveTokenFeed from './components/LiveTokenFeed';
import TrustGauge3D from './components/TrustGauge3D';
import MemePassport from './components/MemePassport';
import Explorer from './components/Explorer';
import WalletAssets from './components/WalletAssets';
import Head from './components/Head';
import MasumiChat from './components/MasumiChat';
import { useWallet } from './context/WalletContext';
import { Shield, Vote, AlertCircle } from 'lucide-react';

export default function Home() {
    const { address } = useWallet();
    const [stats, setStats] = useState({ totalTokens: 0, avgTrust: 0 });
    const [chatContext, setChatContext] = useState<any>(null);

    useEffect(() => {
        // Mock stats fetch
        setStats({ totalTokens: 154, avgTrust: 76 });
    }, []);

    return (
        <div className="space-y-8">
            <Head title="Dashboard | NexGuard" description="Manage your portfolio, view live token feeds, and verify assets." />
            
            {/* Wallet Features Info Banner */}
            {!address && (
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet to Unlock Full Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                                <div className="flex items-start gap-2">
                                    <Vote className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-white">Token Minting</span>
                                        <p className="text-xs mt-1">Create tokens with your wallet address as creator</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-white">Whistleblower Reports</span>
                                        <p className="text-xs mt-1">Submit verified reports linked to your wallet</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Vote className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-white">Community Voting</span>
                                        <p className="text-xs mt-1">One vote per wallet per token - your voice matters</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Live Feed */}
                <div className="lg:col-span-4">
                    <LiveTokenFeed />
                </div>

                {/* Center: Trust Gauge & Stats */}
                <div className="lg:col-span-4">
                    <TrustGauge3D score={stats.avgTrust} />
                </div>

                {/* Right: Wallet Assets or Meme Passport */}
                <div className="lg:col-span-4">
                    {address ? (
                        <WalletAssets />
                    ) : (
                        <MemePassport onContinue={() => { }} identity={null} />
                    )}
                </div>
            </div>

            {/* Main Explorer */}
            <div className="bg-surface backdrop-blur-md border border-glass-outline rounded-2xl p-1 shadow-lg">
                <Explorer onAskMasumi={(coin) => setChatContext(coin)} />
            </div>

            {/* AI Chat Overlay */}
            {chatContext && (
                <MasumiChat
                    context={chatContext}
                    onClose={() => setChatContext(null)}
                />
            )}
        </div>
    );
}
