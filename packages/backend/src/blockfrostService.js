const axios = require('axios');

const BLOCKFROST_KEY = process.env.BLOCKFROST_API_KEY;
const BLOCKFROST_URL = 'https://cardano-preprod.blockfrost.io/api/v0';

const api = axios.create({
    baseURL: BLOCKFROST_URL,
    headers: { project_id: BLOCKFROST_KEY },
    timeout: 10000
});

// Known testnet tokens for demo (can be expanded)
const DEMO_TOKENS = [
    // Add real preprod token policy IDs here
    // You can find these on preprod.cardanoscan.io
];

async function fetchRealToken(assetId) {
    try {
        const [assetInfo, addresses] = await Promise.all([
            api.get(`/assets/${assetId}`),
            api.get(`/assets/${assetId}/addresses`).catch(() => ({ data: [] }))
        ]);

        const asset = assetInfo.data;
        const holders = addresses.data.length;

        // Calculate whale percentage (top holder)
        let whalePercent = 0;
        if (addresses.data.length > 0) {
            const totalQuantity = addresses.data.reduce(
                (sum, a) => sum + parseInt(a.quantity), 0
            );
            const topHolder = Math.max(
                ...addresses.data.map(a => parseInt(a.quantity))
            );
            whalePercent = Math.round((topHolder / totalQuantity) * 100);
        }

        // Calculate trust score based on real metrics
        let trustScore = 50;
        if (holders > 100) trustScore += 20;
        else if (holders > 50) trustScore += 10;
        if (whalePercent < 20) trustScore += 15;
        else if (whalePercent > 50) trustScore -= 20;

        trustScore = Math.max(0, Math.min(100, trustScore));

        // Decode asset name from hex
        let name = 'Unknown Token';
        let symbol = 'UNK';
        if (asset.asset_name) {
            try {
                name = Buffer.from(asset.asset_name, 'hex').toString('utf8');
                symbol = name.slice(0, 4).toUpperCase();
            } catch (e) {
                console.warn('Failed to decode asset name:', asset.asset_name);
            }
        }

        return {
            id: assetId,
            policyId: asset.policy_id,
            name,
            symbol,
            quantity: asset.quantity,
            holders,
            whalePercent,
            trustScore,
            riskLevel: trustScore >= 70 ? 'safe' : trustScore >= 40 ? 'medium' : 'risky',
            flags: whalePercent > 50 ? ['whale_dominance'] : [],
            mintTxHash: asset.initial_mint_tx_hash,
            metadata: asset.onchain_metadata,
            source: 'blockfrost',
            createdAt: new Date().toISOString(),
            price: 0.001 + Math.random() * 0.01, // Simulated price for demo
            priceChange24h: (Math.random() * 20 - 10).toFixed(2),
            volume24h: Math.floor(Math.random() * 100000),
            marketCap: Math.floor(Math.random() * 1000000),
            liquidity: Math.floor(Math.random() * 500000)
        };
    } catch (error) {
        console.error(`Failed to fetch token ${assetId}:`, error.message);
        return null;
    }
}

async function fetchLatestAssets(limit = 5) {
    try {
        const response = await api.get('/assets', {
            params: { count: limit, order: 'desc' }
        });

        const assets = [];

        for (const asset of response.data.slice(0, limit)) {
            const tokenData = await fetchRealToken(asset.asset);
            if (tokenData) {
                assets.push(tokenData);
            }
        }

        return assets;
    } catch (error) {
        console.error('Failed to fetch latest assets:', error.message);
        return [];
    }
}

async function healthCheck() {
    try {
        const response = await api.get('/health');
        return response.data.is_healthy;
    } catch (error) {
        console.error('Blockfrost health check failed:', error.message);
        return false;
    }
}

module.exports = {
    fetchRealToken,
    fetchLatestAssets,
    healthCheck,
    DEMO_TOKENS
};
