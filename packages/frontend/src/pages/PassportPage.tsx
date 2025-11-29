import { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { useWallet } from '../context/WalletContext';
import MemePassport from '../components/MemePassport';

const PassportPage = () => {
    const { address } = useWallet();
    const [identity, setIdentity] = useState<any>(null);
    const [seed, setSeed] = useState('');
    const [generating, setGenerating] = useState(false);

    const generate = async () => {
        setGenerating(true);
        try {
            const useSeed = seed || address || '';
            const res = await axios.post(`${API_URL}/generate-meme-identity`, { seed: useSeed });
            setIdentity(res.data);
        } catch (err) {
            alert('Failed to generate identity');
        } finally {
            setGenerating(false);
        }
    };

    if (identity) {
        return <MemePassport identity={identity} onContinue={() => setIdentity(null)} />;
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Meme Passport</h1>
                    <p className="text-gray-400 text-xl">Generate your unique crypto identity</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Generator Form */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Create Identity</h2>
                            <p className="text-gray-400 text-sm">AI-powered personality based on your wallet</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">Seed (optional)</label>
                                <input
                                    className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    placeholder={address ? `Using: ${address.slice(0, 12)}...` : "Enter custom seed or connect wallet"}
                                    value={seed}
                                    onChange={e => setSeed(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    {address ? 'Your wallet address will be used if seed is empty' : 'Connect wallet for deterministic identity'}
                                </p>
                            </div>

                            <button
                                onClick={generate}
                                disabled={generating}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </span>
                                ) : 'Generate Passport'}
                            </button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI-Generated</h3>
                                    <p className="text-sm text-gray-400">Powered by advanced AI</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Deterministic</h3>
                                    <p className="text-sm text-gray-400">Same seed = same identity</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Unique Personality</h3>
                                    <p className="text-sm text-gray-400">Custom traits & astrology</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">What You'll Get</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-3xl mb-2">👤</div>
                            <h4 className="font-semibold text-white mb-1">Username</h4>
                            <p className="text-sm text-gray-400">A unique meme-worthy name</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">✨</div>
                            <h4 className="font-semibold text-white mb-1">Astrology</h4>
                            <p className="text-sm text-gray-400">Your crypto zodiac sign</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🎯</div>
                            <h4 className="font-semibold text-white mb-1">Traits</h4>
                            <p className="text-sm text-gray-400">Personality characteristics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassportPage;
