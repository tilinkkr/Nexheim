import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Network } from 'lucide-react';
import AntigravityGraph from '../components/AntigravityGraph';

const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

export default function BundleInspector() {
    const [policyId, setPolicyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!policyId) return;
        setLoading(true);
        setResult(null);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/analyze/bundle/${policyId}`);

            if (response.status === 404) {
                throw new Error("API Endpoint not found");
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || "Scan failed");
            }

            const data = await response.json();
            setResult(data);
            console.log("graph-nodes", data.nodes?.length || 0);

        } catch (err) {
            console.error("Bundle scan error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,27,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,27,0.8)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none"></div>

            {/* Content Layer */}
            <div className="relative z-10 pt-24 px-6 h-full flex flex-col">

                {/* Header & Search */}
                <div className="max-w-4xl mx-auto w-full mb-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-sm font-mono mb-4"
                        >
                            <Network className="w-4 h-4" />
                            <span>INSIDER BUNDLE DETECTOR</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                            BUNDLE INSPECTOR
                        </h1>
                    </div>

                    <div className="flex gap-4 max-w-2xl mx-auto">
                        <div className="relative flex-1 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative flex items-center bg-[#0a0a16] border border-white/10 rounded-xl p-1">
                                <Search className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    type="text"
                                    placeholder="Enter Policy ID to trace insider wallets..."
                                    className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none font-mono text-sm"
                                    value={policyId}
                                    onChange={(e) => setPolicyId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleScan}
                            disabled={loading || !policyId}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                        >
                            {loading ? 'SCANNING...' : 'SCAN BUNDLES'}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3 max-w-2xl mx-auto"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Graph Visualization Area */}
                <div className="flex-1 relative border border-white/5 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm min-h-[600px]">
                    {result ? (
                        <AntigravityGraph data={result} />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                            <Network className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-mono text-sm">Waiting for scan data...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
