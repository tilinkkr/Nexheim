import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';

export default function Header() {
    const location = useLocation();
    const isApp = location.pathname.startsWith('/app');

    if (isApp) return null; // App has its own TopBar

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#060608]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-neon/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
                        <ShieldCheck className="w-6 h-6 text-neon relative z-10" />
                    </div>
                    <span className="text-xl font-heading font-bold tracking-wider text-white">
                        NEXGUARD<span className="text-neon">1</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
                    <Link to="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Docs</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/app" className="hidden md:block px-4 py-2 rounded-lg text-sm font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
                        Open App
                    </Link>
                    <ConnectWalletButton />
                </div>
            </div>
        </header>
    );
}
