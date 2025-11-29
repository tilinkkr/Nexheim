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
        <div className="h-full rounded-3xl bg-[#050510] border border-white/10 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] items-center justify-center relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-2xl font-heading font-bold text-white mb-8 z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                Trust Index
            </h2>

            <div className="w-56 h-56 relative z-10 mb-8">
                {/* Outer Glow Ring */}
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse ${score > 80 ? 'bg-green-400' : score < 50 ? 'bg-red-400' : 'bg-yellow-500'}`}></div>

                <CircularProgressbarWithChildren
                    value={score}
                    styles={buildStyles({
                        pathColor: score > 80 ? '#22c55e' : score < 50 ? '#ef4444' : '#eab308',
                        trailColor: 'rgba(255,255,255,0.05)',
                        strokeLinecap: 'round',
                        pathTransitionDuration: 1.5
                    })}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <div className={`text-6xl font-heading font-bold tracking-tighter ${score > 80 ? 'text-green-400' : score < 50 ? 'text-red-400' : 'text-yellow-500'}`}>
                            {score}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium mt-2">Safety Score</div>
                    </motion.div>
                </CircularProgressbarWithChildren>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full z-10">
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group/card hover:bg-white/5 transition-colors">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-blue-400" />
                            <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">Audits</div>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">
                            {audits.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group/card hover:bg-white/5 transition-colors">
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">Scams</div>
                        </div>
                        <div className="text-2xl font-mono font-bold text-red-400">
                            {scams.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
