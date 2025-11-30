import { Sparkles, User, Fingerprint, Wallet } from 'lucide-react';

interface MemeIdentity {
    memeName: string;
    role: string;
    powerLevel: number;
    traits: string[];
    astrology: string;
}

interface MemePassportProps {
    onContinue: () => void;
    identity?: MemeIdentity | null;
}

export default function MemePassport({ onContinue, identity }: MemePassportProps) {
    if (!identity) {
        return (
            <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] items-center justify-center text-center relative overflow-hidden group">
                {/* Holographic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[url('/assets/grid.png')] opacity-10 mix-blend-overlay"></div>

                {/* Animated Icon */}
                <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center backdrop-blur-sm relative z-10">
                        <Fingerprint className="w-10 h-10 text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
                    </div>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-3 tracking-tight">
                    Meme Passport
                </h3>
                <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed mb-8">
                    Connect your wallet to generate your unique <span className="text-blue-400 font-medium">On-Chain Identity</span> and unlock exclusive features.
                </p>

                <button
                    onClick={onContinue}
                    className="w-full max-w-[200px] py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* Premium Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#050510] to-purple-900/20"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                <Fingerprint className="w-32 h-32 text-blue-400 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full bg-[#050510] rounded-xl flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-white tracking-tight">{identity.memeName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                LVL {identity.powerLevel}
                            </span>
                            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">{identity.role}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                        <div className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-1.5">Astrology Sign</div>
                        <div className="text-base text-white font-bold">{identity.astrology}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {identity.traits.map((trait, i) => (
                            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
