const axios = require('axios');

async function testMinswap() {
    try {
        console.log("Testing Minswap Preprod API...");
        // Try to fetch pools
        const res = await axios.get('https://adapter-preprod.minswap.org/adapter/v2/pools?page=1');

        if (res.data && res.data.length > 0) {
            console.log(`✅ Success! Found ${res.data.length} pools.`);
            const sample = res.data[0];
            console.log("Sample Pool:", JSON.stringify(sample, null, 2));

            // Check for price data
            // Usually adapter returns 'price' or 'lastPrice'
        } else {
            console.log("⚠️ API returned empty list or unexpected format.");
            console.log(res.data);
        }
    } catch (err) {
        console.error("❌ Failed to fetch from Minswap:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
    }
}

testMinswap();
