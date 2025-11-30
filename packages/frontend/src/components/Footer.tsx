import { ShieldCheck, Twitter, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0b0c0d] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-6 h-6 text-neon" />
                            <span className="text-xl font-heading font-bold text-white">NEXGUARD</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                            The advanced DeFi safety layer for Cardano. Real-time risk analysis, community-powered audits, and simulated trading environments.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><a href="/app" className="hover:text-neon transition-colors">Dashboard</a></li>
                            <li><a href="/app/mint" className="hover:text-neon transition-colors">Token Sim</a></li>
                            <li><a href="/app/passport" className="hover:text-neon transition-colors">Meme Passport</a></li>
                            <li><a href="/app/audits" className="hover:text-neon transition-colors">Audits</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><a href="/docs" className="hover:text-neon transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-neon transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-neon transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-neon transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                        © 2024 NexGuard. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-300 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-slate-300 hover:text-white transition-colors"><Github size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
