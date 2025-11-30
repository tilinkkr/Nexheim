import React, { useState } from 'react';
import { useHypeRatio } from '../hooks/useHypeRatio';
import HypeRatioCard from '../components/hype/HypeRatioCard';

export default function HypeAnalyzerPage() {
    const [policyId, setPolicyId] = useState('test123');
    const [windowStr, setWindowStr] = useState('60m');
    const [analyzeId, setAnalyzeId] = useState<string | null>('test123');

    const { data, loading, error } = useHypeRatio(analyzeId, windowStr);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hype Analyzer</h1>

            <div className="flex gap-3 mb-4 items-center">
                <input
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                    placeholder="Enter policyId or token id (e.g. test123)"
                    className="border rounded p-2 flex-1 text-black"
                />
                <select value={windowStr} onChange={(e) => setWindowStr(e.target.value)} className="border rounded p-2 text-black">
                    <option value="15m">15m</option>
                    <option value="60m">60m</option>
                    <option value="24h">24h</option>
                </select>
                <button
                    onClick={() => setAnalyzeId(policyId || null)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Analyze
                </button>
            </div>

            <div className="max-w-3xl">
                <HypeRatioCard data={data} loading={loading} error={error} />
            </div>
        </div>
    );
}
