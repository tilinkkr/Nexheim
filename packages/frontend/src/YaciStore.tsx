import { useState } from 'react';
import axios from 'axios';
import './YaciStore.css';

export default function YaciStore() {
    const [assetId, setAssetId] = useState('');
    const [assetData, setAssetData] = useState<any>(null);
    const [txs, setTxs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!assetId) return;
        setLoading(true);
        try {
            const baseUrl = `http://${window.location.hostname}:4000`;
            const assetRes = await axios.get(`${baseUrl}/yaci/assets/${assetId}`);
            setAssetData(assetRes.data);

            const txsRes = await axios.get(`${baseUrl}/yaci/txs/${assetId}`);
            setTxs(txsRes.data);
        } catch (err) {
            console.error("Failed to fetch Yaci data", err);
            alert("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="yaci-container">
            <h2 className="section-title">Yaci Store Explorer (Simulated)</h2>
            <div className="search-box">
                <input
                    className="input-field"
                    value={assetId}
                    onChange={e => setAssetId(e.target.value)}
                    placeholder="Enter Asset ID (e.g., test_asset_1)"
                />
                <button className="primary-btn" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {assetData && (
                <div className="results-area">
                    <div className="card asset-card">
                        <h3>Asset Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Name</label>
                                <span>{assetData.asset_name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Policy ID</label>
                                <span className="mono small">{assetData.policy_id}</span>
                            </div>
                            <div className="detail-item">
                                <label>Quantity</label>
                                <span>{assetData.quantity}</span>
                            </div>
                            <div className="detail-item">
                                <label>Metadata Name</label>
                                <span>{assetData.on_chain_metadata?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card txs-card">
                        <h3>Recent Transactions</h3>
                        <table className="token-table">
                            <thead>
                                <tr>
                                    <th>Tx Hash</th>
                                    <th>Block</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {txs.map((tx, i) => {
                                    const txHash = tx?.tx_hash && typeof tx.tx_hash === 'string'
                                        ? tx.tx_hash.slice(0, 10) + '...'
                                        : 'N/A';
                                    return (
                                        <tr key={i} className="token-row">
                                            <td className="mono small">{txHash}</td>
                                            <td>{tx.block_height || 'N/A'}</td>
                                            <td>{tx.amount || '0'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
