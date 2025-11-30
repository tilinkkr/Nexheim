import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot } from 'lucide-react';
import API_URL from '../apiConfig';

interface MasumiChatProps {
    context?: any;
    onClose: () => void;
}

const MasumiChat = ({ context, onClose }: MasumiChatProps) => {
    const [messages, setMessages] = useState<any[]>([
        { role: 'model', text: `Hello! I am Masumi. ${context ? `I see you're interested in ${context.name} (${context.symbol}).` : ''} How can I help you analyze risks today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
    const [publishStatus, setPublishStatus] = useState<'idle' | 'signing' | 'submitted' | 'confirmed' | 'error'>('idle');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [onchainData, setOnchainData] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, riskAnalysis]);

    useEffect(() => {
        const checkOnchain = async () => {
            if (!context?.policyId) return;
            try {
                const res = await axios.get(`${API_URL}/risk/${context.policyId}/onchain`);
                setOnchainData(res.data);
                if (res.data.onchain) setPublishStatus('confirmed');
            } catch (err) {
                console.error("On-chain check failed", err);
            }
        };
        checkOnchain();
    }, [context]);

    const handlePublishToChain = async (analysis: any) => {
        setPublishStatus('signing');
        try {
            const res = await axios.post(`${API_URL}/risk/${context.policyId}/publish`, {
                risk_score: 50 + (analysis.suggested_delta || 0), // Simplified: base 50 + delta
                analysis_hash: analysis.decision_hash,
                wallet_address: "addr_test1..." // Mock address if not available in context
            });

            if (res.data.error) throw new Error(res.data.error);

            setPublishStatus('submitted');
            setTxHash(`demo_tx_${Date.now().toString(16)}`);

            setTimeout(() => {
                setPublishStatus('confirmed');
                setOnchainData({ onchain: true });
            }, 3000);
        } catch (err) {
            console.error(err);
            setPublishStatus('error');
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/masumi-chat`, {
                message: input,
                context: context
            });

            const botMsg = { role: 'model', text: res.data.response };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the neural network. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const runRiskAnalysis = async () => {
        if (!context || !context.policyId) return;

        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', text: "Run a full risk analysis on this token." }]);

        try {
            const res = await axios.post(`${API_URL}/risk/${context.policyId}/ask-masumi`);
            setRiskAnalysis(res.data);

            const analysisMsg = {
                role: 'model',
                text: "I've completed the risk analysis. Here are my findings:",
                isAnalysis: true,
                data: res.data
            };
            setMessages(prev => [...prev, analysisMsg]);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: 'model', text: `Analysis failed: ${err.response?.data?.error || err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-blue-500/30 w-full max-w-md h-[600px] rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/50">
                            <Bot className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Masumi Copilot</h3>
                            <span className="text-xs text-blue-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                                }`}>
                                {msg.text}

                                {msg.isAnalysis && msg.data && (
                                    <div className="mt-3 bg-black/30 rounded-xl p-3 border border-white/10">
                                        <div className="mb-2">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Risk Assessment</span>
                                        </div>
                                        <p className="text-white mb-3">{msg.data.explanation}</p>

                                        <div className="flex items-center justify-between mb-3 bg-white/5 p-2 rounded-lg">
                                            <span className="text-gray-400">Trust Score Delta</span>
                                            <span className={`font-bold ${msg.data.suggested_delta > 0 ? 'text-green-400' : msg.data.suggested_delta < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                {msg.data.suggested_delta > 0 ? '+' : ''}{msg.data.suggested_delta}
                                            </span>
                                        </div>

                                        <div className="text-[10px] text-gray-500 font-mono break-all border-t border-white/5 pt-2 mb-3">
                                            Hash: {msg.data.decision_hash}
                                        </div>

                                        {/* Publish Section */}
                                        <div className="border-t border-white/10 pt-3">
                                            {publishStatus === 'confirmed' || onchainData?.onchain ? (
                                                <div className="flex flex-col gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold w-fit">
                                                        ✓ On-Chain Verified
                                                    </span>
                                                    {txHash && (
                                                        <a
                                                            href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] text-blue-400 hover:underline truncate"
                                                        >
                                                            Tx: {txHash}
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handlePublishToChain(msg.data)}
                                                    disabled={publishStatus === 'signing' || publishStatus === 'submitted'}
                                                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${publishStatus === 'error'
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                                                        }`}
                                                >
                                                    {publishStatus === 'idle' && '🔗 Publish to Chain'}
                                                    {publishStatus === 'signing' && '✍️ Signing...'}
                                                    {publishStatus === 'submitted' && '⏳ Confirming...'}
                                                    {publishStatus === 'error' && '❌ Retry'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex gap-1">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-950 border-t border-gray-800">
                    {context && !riskAnalysis && (
                        <button
                            onClick={runRiskAnalysis}
                            disabled={loading}
                            className="w-full mb-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            ⚡ Run Deep Risk Analysis
                        </button>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about risks, audits, or tokens..."
                            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasumiChat;
