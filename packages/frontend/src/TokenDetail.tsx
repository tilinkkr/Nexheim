import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Reusing App.css for consistency
import TradingPanel from './components/TradingPanel';
import { useWallet } from './context/WalletContext';
import API_URL from './apiConfig';
import HypeRatioCard from './components/hype/HypeRatioCard';
import { useHypeRatio } from './hooks/useHypeRatio';
import { RugMeter } from './components/features/risk/RugMeter';

interface TokenDetailProps {
    token: any;
    onBack: () => void;
    onUpdate: (updatedToken: any) => void;
}

export default function TokenDetail({ token, onBack, onUpdate }: TokenDetailProps) {
    const { address } = useWallet();
    const [showModal, setShowModal] = useState(false);
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [auditLog, setAuditLog] = useState<any>(null);
    const { data: hypeData, loading: hypeLoading, error: hypeError } = useHypeRatio(token?.policyId, '60m');

    const handleSubmitReport = async () => {
        if (reportText.length <= 10) {
            alert("Report must be longer than 10 characters.");
            return;
        }

        if (!address) {
            alert("Please connect your wallet to submit reports.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/whistle`, {
                tokenId: token.tokenId,
                reportText,
                reporterId: address // Link to wallet
            });

            alert(`Report Accepted! New Trust Score: ${res.data.newScore}`);

            // Refresh token details
            const updated = await axios.get(`${API_URL}/token/${token.tokenId}`);
            onUpdate(updated.data);
            setShowModal(false);
            setReportText('');
        } catch (err) {
            alert("Failed to submit report: " + err);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/publish/${token.tokenId}`);
            setAuditLog(res.data);
        } catch (err) {
            alert("Failed to publish analysis: " + err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (voteType: 'agree' | 'disagree') => {
        if (!address) {
            alert("Please connect your wallet to vote.");
            return;
        }

        try {
            await axios.post(`${API_URL}/vote`, {
                tokenId: token.tokenId,
                vote: voteType,
                voterId: address // Link to wallet
            });
            // Update local state or trigger refresh
            // Ideally we should just update the token prop, but for now we'll fetch fresh data
            const updated = await axios.get(`${API_URL}/token/${token.tokenId}`);
            onUpdate(updated.data);
            alert(`Voted ${voteType}!`);
        } catch (err) {
            alert("Vote failed: " + err);
        }
    };

    return (
        <div className="detail-card card">
            <div className="detail-header">
                <button className="back-btn" onClick={onBack}>&larr; Back</button>
                <h2>Token Details</h2>
            </div>

            <div className="detail-grid">
                <div className="detail-item">
                    <label>Name</label>
                    <span>{token.name}</span>
                </div>
                <div className="detail-item">
                    <label>Symbol</label>
                    <span>{token.symbol}</span>
                </div>
                <div className="detail-item">
                    <span className={`score-value ${token.trust_score >= 70 ? 'high' : token.trust_score >= 40 ? 'med' : 'low'}`}>
                        {token.trust_score}/100
                    </span>
                </div>
                <div className="detail-item">
                    <label>Community Votes</label>
                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={() => handleVote('agree')}
                            disabled={!address}
                            className="bg-green-900/50 hover:bg-green-800 text-green-400 text-xs px-2 py-1 rounded border border-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!address ? 'Connect wallet to vote' : 'Vote Safe'}
                        >
                            👍 {token.votes?.agree || 0} Safe
                        </button>
                        <button
                            onClick={() => handleVote('disagree')}
                            disabled={!address}
                            className="bg-red-900/50 hover:bg-red-800 text-red-400 text-xs px-2 py-1 rounded border border-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!address ? 'Connect wallet to vote' : 'Vote Scam'}
                        >
                            👎 {token.votes?.disagree || 0} Scam
                        </button>
                    </div>
                </div>
                <div className="detail-item">
                    <label>Token ID</label>
                    <span className="mono">{token.tokenId}</span>
                </div>
                <div className="detail-item">
                    <label>Created At</label>
                    <span className="mono">{new Date(token.created_at).toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <HypeRatioCard data={hypeData} loading={hypeLoading} error={hypeError} />
                <RugMeter policyId={token.policyId} />
            </div>

            {
                token.explain && token.explain.length > 0 && (
                    <div className="risk-section">
                        <h3>Risk Analysis</h3>
                        <ul className="risk-list">

                            {token.yaci_data && (
                                <div className="yaci-data-section">
                                    <h3>Yaci Store Data</h3>
                                    <p><b>DEX:</b> {token.yaci_data.liquidity_info?.dex}</p>
                                    <p><b>Liquidity:</b> {token.yaci_data.liquidity_info?.total_liquidity_ada} ADA</p>
                                </div>
                            )}

                            {auditLog && (
                                <div className="audit-section">
                                    <h3>Audit Log Published</h3>
                                    <div className="audit-details">
                                        <p><b>Tx ID:</b> <span className="mono">{auditLog.txid}</span></p>
                                        <p><b>Hash:</b> <span className="mono">{auditLog.analysisHash}</span></p>
                                        <p><b>Time:</b> {new Date(auditLog.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <TradingPanel />
                        </ul>

                        <div className="actions-section">
                            {!address && (
                                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                                    🔐 Connect your wallet to vote, report, and trade
                                </div>
                            )}
                            <button className="secondary-btn" onClick={handlePublish} disabled={loading}>
                                {loading ? 'Publishing...' : 'Publish Analysis'}
                            </button>
                            <button className="danger-btn" onClick={() => setShowModal(true)} disabled={!address}>
                                {address ? 'Report Risk (Whistleblower)' : 'Connect Wallet to Report'}
                            </button>
                        </div>

                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3>Submit Whistleblower Report</h3>
                                    <p>Describe the suspicious activity. This will trigger a ZK-proof verification (simulated).</p>
                                    <textarea
                                        className="report-input"
                                        value={reportText}
                                        onChange={e => setReportText(e.target.value)}
                                        placeholder="Enter details (min 10 chars)..."
                                    />
                                    <div className="modal-actions">
                                        <button className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className="primary-btn" onClick={handleSubmitReport} disabled={loading}>
                                            {loading ? 'Submitting...' : 'Submit Report'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
}
