import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Coins, Database, RefreshCw } from 'lucide-react';

const WalletAssets = () => {
    const { walletApi, address } = useWallet();
    const [utxos, setUtxos] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [networkId, setNetworkId] = useState<number | null>(null);

    const fetchWalletData = async () => {
        if (!walletApi) return;

        setLoading(true);
        try {
            // Get UTxOs
            const utxoHexList = await walletApi.getUtxos();
            console.log('UTxOs (hex):', utxoHexList);
            setUtxos(utxoHexList || []);

            // Get network ID
            const netId = await walletApi.getNetworkId();
            setNetworkId(netId);
            console.log('Network ID:', netId, netId === 1 ? '(Mainnet)' : '(Testnet)');

            // Parse assets from balance (simplified)
            const balanceHex = await walletApi.getBalance();
            console.log('Balance (hex):', balanceHex);
            
            // Note: Full asset parsing requires CBOR library
            // For demo, we'll show basic info
            setAssets([{
                name: 'ADA',
                amount: (parseInt(balanceHex, 16) / 1_000_000).toFixed(2),
                unit: '₳'
            }]);

        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (walletApi) {
            fetchWalletData();
        }
    }, [walletApi]);

    if (!address) {
        return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Connect your wallet to view assets and UTxOs</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Coins className="text-blue-500" />
                    Wallet Assets & UTxOs
                </h3>
                <button
                    onClick={fetchWalletData}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Network Info */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Network:</span>
                    <span className={`font-mono ${networkId === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {networkId === 1 ? 'Mainnet' : networkId === 0 ? 'Testnet' : 'Unknown'}
                    </span>
                </div>

                {/* Assets */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Assets</h4>
                    <div className="space-y-2">
                        {assets.map((asset, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-950 rounded-lg border border-gray-800">
                                <span className="text-white font-medium">{asset.name}</span>
                                <span className="text-blue-400 font-mono">
                                    {asset.unit}{asset.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UTxOs */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        UTxOs ({utxos.length})
                    </h4>
                    {utxos.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {utxos.map((utxo, i) => (
                                <div key={i} className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                                    <div className="text-xs font-mono text-gray-400 break-all">
                                        UTxO #{i + 1}: {utxo.slice(0, 40)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No UTxOs found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletAssets;
