import { Sparkles, User } from 'lucide-react';

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
            <div className="bg-surface backdrop-blur-md border border-glass-outline rounded-2xl p-6 shadow-lg h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mb-2">
                    <User className="w-8 h-8 text-neon" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white">Meme Passport</h3>
                <p className="text-sm text-slate-300 max-w-[200px]">Connect wallet to generate your unique on-chain identity.</p>
                <button onClick={onContinue} className="px-4 py-2 rounded-xl bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-all font-bold text-sm">
                    Connect & Generate
                </button>
            </div>
        );
    }

    return (
        <div className="bg-surface backdrop-blur-md border border-glass-outline rounded-2xl p-6 shadow-lg h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles className="w-24 h-24 text-neon" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon to-electric flex items-center justify-center shadow-lg shadow-neon/20">
                        <User className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white">{identity.memeName}</h3>
                        <div className="text-xs font-mono text-neon bg-neon/10 px-2 py-0.5 rounded-full inline-block border border-neon/20">
                            LVL {identity.powerLevel} {identity.role}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">Astrology</div>
                        <div className="text-sm text-white font-medium">{identity.astrology}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {identity.traits.map((trait, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
