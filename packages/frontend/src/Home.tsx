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
    const [stats, setStats] = useState({ avgTrust: 0, totalAudits: 0, scamsDetected: 0 });
    const [chatContext, setChatContext] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/stats/global');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) {
                console.error("Stats fetch error", e);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#050510] px-8 py-8">
            <Head title="Dashboard | NexGuard" description="Manage your portfolio, view live token feeds, and verify assets." />

            {/* Main 3-column grid + bottom row */}
            <div className="grid gap-6 lg:grid-cols-3 grid-rows-[320px_auto]">
                {/* LEFT: Live Threat Feed */}
                <section className="col-span-1">
                    <LiveTokenFeed />
                </section>

                {/* CENTER: Trust Index (big center card) */}
                <section className="col-span-1">
                    <TrustGauge3D score={stats.avgTrust} audits={stats.totalAudits} scams={stats.scamsDetected} />
                </section>

                {/* RIGHT: Wallet + Meme Passport stacked */}
                <section className="col-span-1 flex flex-col gap-4">
                    {/* Wallet Banner */}
                    {!address && (
                        <div className="rounded-3xl bg-[#050510] border border-white/10 p-4 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-white mb-2">Connect Wallet</h3>
                                    <div className="space-y-1 text-xs text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Vote className="w-3 h-3 text-green-400" />
                                            <span>Token Minting</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                                            <span>Whistleblower Reports</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Vote className="w-3 h-3 text-blue-400" />
                                            <span>Community Voting</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Meme Passport or Wallet Assets */}
                    {address ? (
                        <WalletAssets />
                    ) : (
                        <MemePassport onContinue={() => { }} identity={null} />
                    )}
                </section>

                {/* BOTTOM: Token Explorer full width */}
                <section className="col-span-full">
                    <Explorer onAskMasumi={(coin) => setChatContext(coin)} />
                </section>
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
