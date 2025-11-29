const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log("🚀 Starting Final Verification...");

    try {
        // 1. Auth Nonce
        console.log("\n1. Testing Auth Nonce...");
        const nonceRes = await axios.get(`${BASE_URL}/auth/nonce?address=addr_test123`);
        console.log("   ✅ Nonce:", nonceRes.data.nonce);

        // 2. Auth Wallet
        console.log("\n2. Testing Wallet Login...");
        const loginRes = await axios.post(`${BASE_URL}/auth/wallet`, {
            address: "addr_test123",
            signature: "sig_mock"
        });
        console.log("   ✅ Token:", loginRes.data.token ? "Received" : "Missing");

        // 3. Mint
        console.log("\n3. Testing Mint...");
        const mintRes = await axios.post(`${BASE_URL}/simulate/mint`, { name: "FinalToken", symbol: "FIN" });
        const tokenId = mintRes.data.tokenId;
        console.log("   ✅ Minted:", tokenId);

        // 4. Publish
        console.log("\n4. Testing Publish...");
        await axios.post(`${BASE_URL}/publish/${tokenId}`);
        console.log("   ✅ Published");

        // 5. Report
        console.log("\n5. Testing Report...");
        await axios.post(`${BASE_URL}/report`, {
            tokenId,
            reportText: "Suspicious activity detected",
            reporterId: "user_test"
        });
        console.log("   ✅ Reported");

        // 6. Vote
        console.log("\n6. Testing Vote...");
        await axios.post(`${BASE_URL}/vote`, { tokenId, vote: 'agree' });
        console.log("   ✅ Voted");

        // 7. Audits
        console.log("\n7. Testing Audits...");
        const auditsRes = await axios.get(`${BASE_URL}/audits`);
        console.log(`   ✅ Audits Found: ${auditsRes.data.length}`);

        // 8. Explorer
        console.log("\n8. Testing Explorer...");
        const explorerRes = await axios.get(`${BASE_URL}/explorer`);
        console.log(`   ✅ Tokens in Explorer: ${explorerRes.data.length}`);

        console.log("\n🎉 ALL TESTS PASSED!");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
        if (err.response) {
            console.error("   Response:", err.response.data);
        }
    }
}

runTests();
