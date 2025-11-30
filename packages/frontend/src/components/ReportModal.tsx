import { useState } from 'react';
import { ShieldAlert, Lock, X, Loader2 } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (riskType: string, evidence: string) => void;
    coinName: string;
}

const ReportModal = ({ isOpen, onClose, onSubmit, coinName }: ReportModalProps) => {
    const [riskType, setRiskType] = useState('Rug Pull Code');
    const [evidence, setEvidence] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setIsGenerating(true);
        // Simulate ZK Proof Generation Delay
        setTimeout(() => {
            onSubmit(riskType, evidence);
            setEvidence('');
            setRiskType('Rug Pull Code');
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl shadow-red-900/20 animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                        <ShieldAlert />
                        Midnight ZK Portal
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold">
                            <Lock size={16} />
                            Reporting {coinName} anonymously via ZK-Proof.
                        </div>
                        <div className="text-xs opacity-70 italic">
                            * This is a simulation. In production, this will generate a valid ZK proof using Midnight.
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Risk Type</label>
                        <select
                            value={riskType}
                            onChange={(e) => setRiskType(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                        >
                            <option>Rug Pull Code</option>
                            <option>Locked Liquidity</option>
                            <option>Minting Exploit</option>
                            <option>Wash Trading</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Evidence / Details</label>
                        <textarea
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none h-24 resize-none"
                            placeholder="Paste transaction hash or describe the issue..."
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Generating ZK Proof...
                            </>
                        ) : (
                            <>
                                <ShieldAlert size={18} />
                                Submit ZK Proof
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
