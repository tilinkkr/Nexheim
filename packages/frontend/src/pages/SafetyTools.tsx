import { motion } from 'framer-motion';
import { Network, Shield, ArrowRight, Lock, Eye, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SafetyTools() {
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white pt-24 pb-12 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-mono mb-6 backdrop-blur-md">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>INSTITUTIONAL GRADE SECURITY SUITE</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        VERIFY BEFORE YOU <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">DEGEN</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Advanced forensic tools to detect rug pulls, analyze wash trading, and audit token policies in real-time.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Bundle Inspector Card */}
                    <motion.div
                        variants={item}
                        className="group relative rounded-3xl bg-[#0a0a16] border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Network className="w-8 h-8 text-purple-400" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors">Bundle Inspector</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed h-24">
                                Visualize hidden wallet connections in 3D. Our graph theory engine detects "insider bundles"—clusters of wallets funded by the same source to fake volume and snipe supplies.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Activity className="w-4 h-4 text-purple-500" />
                                    <span>Wash Trade Detection</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Eye className="w-4 h-4 text-purple-500" />
                                    <span>Visual Graph Trace</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/bundle-inspector')}
                                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                            >
                                LAUNCH INSPECTOR
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Policy X-Ray Card */}
                    <motion.div
                        variants={item}
                        className="group relative rounded-3xl bg-[#0a0a16] border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Shield className="w-8 h-8 text-blue-400" />
                            </div>

                            <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">Policy X-Ray</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed h-24">
                                Deep dive into smart contract policies. Masumi AI analyzes minting authorities, liquidity lock durations, and holder distributions to calculate a precise risk score.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Lock className="w-4 h-4 text-blue-500" />
                                    <span>Liquidity Analysis</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Zap className="w-4 h-4 text-blue-500" />
                                    <span>AI Risk Scoring</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/xray')}
                                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            >
                                START X-RAY SCAN
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
