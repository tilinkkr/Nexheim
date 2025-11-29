import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustGaugeProps {
    score?: number;
    audits?: number;
    scams?: number;
}

export default function TrustGauge3D({ score = 0, audits = 0, scams = 0 }: TrustGaugeProps) {
    return (
        <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-4 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.7)] items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none"></div>

            <h2 className="text-xl font-heading font-bold text-white mb-6 z-10 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Trust Index
            </h2>

            <div className="w-48 h-48 relative z-10 mb-4">
                <CircularProgressbarWithChildren
                    value={score}
                    styles={buildStyles({
                        pathColor: score > 80 ? '#00FF88' : score < 50 ? '#FF6B6B' : '#EAB308',
                        trailColor: 'rgba(255,255,255,0.1)',
                        strokeLinecap: 'round',
                        pathTransitionDuration: 1.5
                    })}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <div className={`text-5xl font-heading font-bold ${score > 80 ? 'text-green-400' : score < 50 ? 'text-red-400' : 'text-yellow-500'}`}>
                            {score}
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Safety Score</div>
                    </motion.div>
                </CircularProgressbarWithChildren>

                {/* Decorative glow behind */}
                <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 ${score > 80 ? 'bg-green-400' : score < 50 ? 'bg-red-400' : 'bg-yellow-500'}`}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full z-10">
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Activity className="w-3 h-3 text-blue-400" />
                            <div className="text-xs text-slate-400 uppercase">Audits</div>
                        </div>
                        <div className="text-xl font-mono font-bold text-white">
                            {audits.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <div className="text-xs text-slate-400 uppercase">Scams</div>
                        </div>
                        <div className="text-xl font-mono font-bold text-red-400">
                            {scams.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
