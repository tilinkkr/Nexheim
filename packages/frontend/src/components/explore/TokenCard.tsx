import { motion } from "framer-motion";
import { Shield, AlertTriangle, Activity, Zap } from "lucide-react";

// PRO TIP: Define interfaces for Type Safety (The "Adult" way)
interface TokenProps {
    name: string;
    ticker: string;
    score: number;
    status: "SAFE" | "MEDIUM" | "HIGH RISK";
    audits: number;
    scams: number;
}

const TokenCard = ({ data }: { data: TokenProps }) => {
    // Determine color logic dynamically
    const isSafe = data.score >= 80;
    const isRisk = data.score < 50;

    const accentColor = isSafe ? "text-nex-safe" : isRisk ? "text-nex-risk" : "text-nex-warn";
    const borderColor = isSafe ? "border-nex-safe/30" : isRisk ? "border-nex-risk/30" : "border-nex-warn/30";

    return (
        <motion.div
            // ANTIGRAVITY PHYSICS:
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}

            // THE GLASS LOOK:
            className={`relative p-5 rounded-2xl bg-nex-card border ${borderColor} 
      bg-glass-gradient backdrop-blur-xl shadow-lg hover:shadow-neon-hover cursor-pointer group`}
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        {data.name}
                        <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                            {data.ticker}
                        </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-400">Live Detection</span>
                    </div>
                </div>

                {/* The Score Ring (Simplified for ease) */}
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 ${borderColor} bg-black/40`}>
                    <span className={`text-lg font-bold ${accentColor}`}>{data.score}</span>
                </div>
            </div>

            {/* Badges / Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-gray-800">
                    <Shield size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-300">{data.audits} Audits</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-gray-800">
                    <AlertTriangle size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-300">{data.scams} Flags</span>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2.5 mt-2 rounded-xl bg-nex-primary/10 border border-nex-primary/30 text-nex-primary font-semibold text-sm 
      group-hover:bg-nex-primary group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <Zap size={16} />
                Analyze Token
            </button>
        </motion.div>
    );
};

export default TokenCard;
