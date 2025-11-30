const axios = require('axios');
require('dotenv').config();

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || 'testnet_YOUR_API_KEY_HERE'; // User needs to set this

async function getTokenData(policyId) {
    if (!policyId) return null;

    // If using a placeholder key, return mock data to prevent crash
    if (BLOCKFROST_API_KEY.includes('YOUR_API_KEY')) {
        console.warn("Blockfrost API Key not set. Returning mock data.");
        return {
            asset: policyId + "mock_asset",
            policy_id: policyId,
            asset_name: "4d6f636b546f6b656e", // Hex for MockToken
            fingerprint: "asset1mockfingerprint",
            quantity: "1000000",
            onchain_metadata: {
                name: "Mock Token (Blockfrost Placeholder)",
                image: "ipfs://mockimage",
                description: "This is a mock response because API Key is missing."
            }
        };
    }

    try {
        const url = `https://cardano-testnet.blockfrost.io/api/v0/assets/${policyId}`;
        const res = await axios.get(url, {
            headers: { project_id: BLOCKFROST_API_KEY }
        });
        return res.data;
    } catch (error) {
        console.error("Blockfrost API Error:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getTokenData };
