const axios = require('axios');
require('dotenv').config();

const YACI_STORE_URL = process.env.YACI_STORE_URL || 'http://localhost:8080';

async function fetchTokenMetadata(policyId) {
    // 1. Try fetching from Real Yaci Store API
    if (YACI_STORE_URL) {
        try {
            console.log(`Attempting to fetch from Yaci Store: ${YACI_STORE_URL}/api/v1/assets/${policyId}`);

            // Note: In a real scenario, we might need to handle different endpoint structures.
            // For now, we assume a direct asset fetch or a policy search.

            const url = policyId.length > 56
                ? `${YACI_STORE_URL}/api/v1/assets/${policyId}`
                : `${YACI_STORE_URL}/api/v1/assets/policy/${policyId}`;

            const res = await axios.get(url, { timeout: 3000 });

            if (res.data) {
                console.log("✅ Yaci Store Data Found");
                return {
                    holders_snapshot: {
                        total_holders: res.data.total_supply ? 100 : 0, // Mocked holder count if not in response
                        top_holders: []
                    },
                    liquidity_info: {
                        dex: "Yaci Devnet",
                        total_liquidity_ada: 1000000
                    },
                    raw_data: res.data,
                    source: 'yaci'
                };
            }
        } catch (err) {
            console.warn(`⚠️ Failed to fetch from Yaci Store (${err.message}). Falling back to simulation.`);
        }
    }

    // 2. Fallback to Simulation
    return {
        holders_snapshot: {
            total_holders: Math.floor(Math.random() * 1000) + 50,
            top_holders: [
                { address: "addr_test1...a", amount: "5000" },
                { address: "addr_test1...b", amount: "3000" },
                { address: "addr_test1...c", amount: "1000" }
            ]
        },
        liquidity_info: {
            dex: "Minswap (Simulated)",
            pool_url: "#",
            total_liquidity_ada: Math.floor(Math.random() * 50000) + 10000
        },
        is_simulated: true,
        source: 'simulation'
    };
}

module.exports = { fetchTokenMetadata };
