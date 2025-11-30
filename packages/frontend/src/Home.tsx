import { useState, useEffect } from 'react';
import LiveTokenFeed from './components/LiveTokenFeed';
import TrustGauge3D from './components/TrustGauge3D';
import MemePassport from './components/MemePassport';
import Explorer from './components/Explorer';
import WalletAssets from './components/WalletAssets';
import Head from './components/Head';
import MasumiChat from './components/MasumiChat';
import { useWallet } from './context/WalletContext';
import { IncidentSheet } from './components/IncidentSheet';
import type { IncidentDetails } from './types/incident';

export default function Home() {
    const { address } = useWallet();
    const [stats, setStats] = useState({ avgTrust: 0, totalAudits: 0, scamsDetected: 0 });
    const [chatContext, setChatContext] = useState<any>(null);
    const [activePolicyId, setActivePolicyId] = useState<string | null>(null);

    useEffect(() => {
        if (activePolicyId) {
            console.log("Active Policy ID updated:", activePolicyId);
        }
    }, [activePolicyId]);

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

    const mockIncident: IncidentDetails = {
        policyId: activePolicyId || '',
        tokenSymbol: 'MOCK',
        trustScore: 65,
        trustHistory: [60, 62, 65, 64, 65],
        masumiSummary: "This token shows signs of high volatility but no direct rug pull indicators. Community sentiment is mixed.",
        insiderRisk: 45,
        votesSafe: 120,
        votesRisky: 45,
        reportsCount: 3
    };

    return (
        <div className="min-h-screen w-full bg-[#050510] px-8 py-8">
            <Head title="Dashboard | NexGuard" description="Manage your portfolio, view live token feeds, and verify assets." />

            {/* Main 3-column grid + bottom row */}
            <div className="grid gap-6 lg:grid-cols-3 grid-rows-[320px_auto]">
                {/* LEFT: Live Threat Feed */}
                <section className="col-span-1">
                    <LiveTokenFeed onTokenClick={(p) => setActivePolicyId(p)} disableModal={true} />
                </section>

                {/* CENTER: Trust Index (big center card) */}
                <section className="col-span-1">
                    <TrustGauge3D score={stats.avgTrust} audits={stats.totalAudits} scams={stats.scamsDetected} />
                </section>

                {/* RIGHT: Wallet + Meme Passport stacked */}
                <section className="col-span-1 flex flex-col gap-4">
                    {/* Meme Passport or Wallet Assets */}
                    {address ? (
                        <WalletAssets />
                    ) : (
                        <MemePassport onContinue={() => { }} identity={null} />
                    )}
                </section>

                {/* BOTTOM: Token Explorer full width */}
                <section className="col-span-full">
                    <Explorer
                        onAskMasumi={(coin) => setChatContext(coin)}
                        onTokenClick={(p) => setActivePolicyId(p)}
                    />
                </section>
            </div>

            {/* Incident Sheet */}
            <IncidentSheet
                open={!!activePolicyId}
                onClose={() => setActivePolicyId(null)}
                loading={false}
                data={activePolicyId ? mockIncident : null}
            />

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
