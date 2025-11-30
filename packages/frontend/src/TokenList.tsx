import { useEffect, useState } from "react";
import axios from "axios";
import './TokenList.css';

function badgeColor(score: number) {
    if (score >= 70) return "var(--success-color)";
    if (score >= 40) return "var(--warning-color)";
    return "var(--danger-color)";
}

export default function TokenList({ onSelect }: { onSelect: (tid: string) => void }) {
    const [tokens, setTokens] = useState<any[]>([]);

    const fetchTokens = () => {
        const baseUrl = `http://${window.location.hostname}:4000`;
        axios.get(`${baseUrl}/tokens`).then(res => setTokens(res.data));
    };

    useEffect(() => {
        fetchTokens();
        // Poll for updates every 5 seconds to keep the list fresh
        const interval = setInterval(fetchTokens, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="token-list-container">
            <h2 className="section-title">Token Dashboard</h2>
            <div className="table-wrapper">
                <table className="token-table">
                    <thead>
                        <tr>
                            <th>Trust</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map(t => (
                            <tr key={t.tokenId} className="token-row">
                                <td>
                                    <div className="trust-badge" style={{ backgroundColor: badgeColor(t.trust_score) }}></div>
                                </td>
                                <td className="token-name">
                                    <span className="name">{t.name}</span>
                                    <span className="symbol">{t.symbol}</span>
                                </td>
                                <td className="token-score">{t.trust_score}</td>
                                <td>
                                    <button className="view-btn" onClick={() => onSelect(t.tokenId)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tokens.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No tokens minted yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
