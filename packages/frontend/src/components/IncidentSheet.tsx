import React from "react";
import { X } from "lucide-react";
import type { IncidentDetails } from "../types/incident";

interface Props {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    data: IncidentDetails | null;
}

export function IncidentSheet({ open, onClose, loading, data }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <div className="h-full w-full max-w-xl bg-[#050510] border-l border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-right duration-300">
                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Incident Sheet
                        </h2>
                        {data && (
                            <p className="text-xs text-gray-400">
                                {data.tokenSymbol} • {data.policyId.slice(0, 8)}…
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </header>

                {/* Trust Index + sparkline placeholder */}
                <section className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Trust Score History</h3>
                    <div className="h-24 flex items-center justify-center text-gray-500 text-xs border border-dashed border-white/10 rounded-xl">
                        [Sparkline Placeholder]
                    </div>
                </section>

                {/* Masumi summary */}
                <section className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Masumi Analysis</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {data?.masumiSummary || "No analysis available."}
                    </p>
                </section>

                {/* Insider Risk + community stats + actions */}
                <section className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300">Insider Risk</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${(data?.insiderRisk || 0) > 50 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                            {data?.insiderRisk}%
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Community Safe</p>
                            <p className="text-lg font-bold text-green-400">{data?.votesSafe || 0}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Community Risky</p>
                            <p className="text-lg font-bold text-red-400">{data?.votesRisky || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <button className="py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-colors">
                            Vote Safe
                        </button>
                        <button className="py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors">
                            Vote Risky
                        </button>
                        <button className="py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-colors">
                            Report
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
