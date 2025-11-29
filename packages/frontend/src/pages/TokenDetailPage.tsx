import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';
import TokenDetail from '../TokenDetail';
import { Loader2 } from 'lucide-react';

export default function TokenDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [token, setToken] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            if (!id) return;
            try {
                // Try fetching from backend first
                const res = await axios.get(`${API_URL}/api/memecoins/${id}`);
                setToken(res.data);
            } catch (err) {
                console.error("Failed to fetch token", err);
                // Fallback or error handling
                // For demo purposes, if it fails, we might want to try the explorer endpoint or show error
                setError("Token not found");
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
                <h2 className="text-xl font-bold text-red-500">Error</h2>
                <p>{error || "Token not found"}</p>
                <button
                    onClick={() => navigate('/app')}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <TokenDetail
            token={token}
            onBack={() => navigate('/app')}
            onUpdate={(updated) => setToken(updated)}
        />
    );
}
