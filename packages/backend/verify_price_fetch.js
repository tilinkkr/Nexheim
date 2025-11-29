require('dotenv').config();
const { fetchLatestAssets } = require('./src/blockfrostService');

async function verify() {
    console.log("Fetching latest assets from Blockfrost...");
    try {
        const assets = await fetchLatestAssets(3);

        if (assets.length === 0) {
            console.log("No assets found (check API key or network).");
            return;
        }

        console.log(`Fetched ${assets.length} assets.`);

        assets.forEach(asset => {
            console.log(`\nToken: ${asset.name} (${asset.symbol})`);
            console.log(`Price: ${asset.price} ADA`);
            console.log(`Market Cap: ${asset.marketCap} ADA`);
            console.log(`Liquidity: ${asset.liquidity} ADA`);
            console.log(`Source: ${asset.source}`);
        });

        console.log("\n✅ Verification Complete: Assets fetched with price fields.");
    } catch (err) {
        console.error("❌ Verification Failed:", err);
    }
}

verify();
