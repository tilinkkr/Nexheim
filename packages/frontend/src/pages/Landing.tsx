import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, ArrowRight } from 'lucide-react';
import BackgroundScene from '../components/BackgroundScene';
import Head from '../components/Head';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#060608] text-white overflow-hidden">
            <Head />
            <BackgroundScene lowPower={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
                            </span>
                            LIVE ON CARDANO DEVNET
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Verify Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-electric">Degen</span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            NexGuard combines AI-driven risk analysis, community reporting, and simulated trading to help you navigate the crypto wild west safely.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/app" className="px-8 py-4 rounded-xl bg-neon text-black font-bold text-lg hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2">
                                Launch App <ArrowRight size={20} />
                            </Link>
                            <Link to="/docs" className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all">
                                Read Docs
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-[#0b0c0d]/50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-neon" />}
                            title="AI Risk Analysis"
                            desc="Masumi Copilot analyzes token metadata, distribution, and social sentiment in real-time."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-electric" />}
                            title="Community Audits"
                            desc="Decentralized whistleblower system with ZK-proof verification for reporting scams."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-violet" />}
                            title="Simulated Trading"
                            desc="Practice your strategies in a risk-free environment before deploying real capital."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How It Works</h2>
                        <p className="text-slate-300">Three simple steps to safer trading.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <Step number="01" title="Detect" desc="Our AI scans new token launches instantly." />
                        <Step number="02" title="Verify" desc="Community votes and reports validate the risk." />
                        <Step number="03" title="Trade" desc="Execute trades with confidence or simulate first." />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-neon/10 to-electric/10 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 relative z-10">Ready to start?</h2>
                    <p className="text-slate-200 mb-8 max-w-xl mx-auto relative z-10">
                        Join thousands of traders using NexGuard to protect their portfolio.
                    </p>
                    <Link to="/app" className="inline-block px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all relative z-10">
                        Open Dashboard
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <div className="mb-6 p-4 rounded-xl bg-black/40 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-slate-300 leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ number, title, desc }: any) {
    return (
        <div className="text-center relative">
            <div className="text-6xl font-heading font-bold text-white/5 mb-4">{number}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-slate-300">{desc}</p>
        </div>
    );
}
