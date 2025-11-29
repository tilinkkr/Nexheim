import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ShieldCheck } from 'lucide-react';

export default function TrustGauge3D({ score = 85 }: { score?: number }) {
    return (
        <div className="bg-surface backdrop-blur-md border border-glass-outline rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none"></div>

            <h2 className="text-xl font-heading font-bold text-white mb-6 z-10">Trust Index</h2>

            <div className="w-48 h-48 relative z-10">
                <CircularProgressbarWithChildren
                    value={score}
                    styles={buildStyles({
                        pathColor: score > 80 ? '#00FF88' : score < 50 ? '#FF6B6B' : '#EAB308',
                        trailColor: 'rgba(255,255,255,0.1)',
                        strokeLinecap: 'butt',
                        pathTransitionDuration: 1.5
                    })}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <ShieldCheck className={`w-10 h-10 mb-2 ${score > 80 ? 'text-neon' : score < 50 ? 'text-danger' : 'text-yellow-500'}`} />
                        <div className="text-4xl font-heading font-bold text-white">{score}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Safety Score</div>
                    </div>
                </CircularProgressbarWithChildren>

                {/* Decorative glow behind */}
                <div className={`absolute inset-0 blur-3xl opacity-30 -z-10 ${score > 80 ? 'bg-neon' : score < 50 ? 'bg-danger' : 'bg-yellow-500'}`}></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 w-full z-10">
                <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400">Audits</div>
                    <div className="text-lg font-mono font-bold text-white">1,240</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400">Scams</div>
                    <div className="text-lg font-mono font-bold text-danger">42</div>
                </div>
            </div>
        </div>
    );
}
