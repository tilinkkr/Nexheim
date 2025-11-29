const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function testEndpoints() {
    try {
        console.log("1. Minting a token...");
        const mintRes = await axios.post(`${API_URL}/api/simulate/mint`, { name: "TestToken", symbol: "TST" });
        const tokenId = mintRes.data.tokenId;
        console.log("   Minted:", tokenId);

        console.log("2. Testing /publish/:tokenId...");
        const pubRes = await axios.post(`${API_URL}/api/publish/${tokenId}`);
        console.log("   Publish Response:", pubRes.data);

        console.log("3. Testing /whistle...");
        const whistleRes = await axios.post(`${API_URL}/whistle`, {
            tokenId: tokenId,
            reportText: "This is a test report for whistleblowing.",
            reporterId: "tester"
        });
        console.log("   Whistle Response:", whistleRes.data);

        console.log("4. Testing /vote...");
        const voteRes = await axios.post(`${API_URL}/api/vote`, { tokenId: tokenId, vote: "agree" });
        console.log("   Vote Response:", voteRes.data);

        console.log("5. Testing /trade...");
        const tradeRes = await axios.post(`${API_URL}/api/trade`, { tokenId: tokenId, type: "buy", amount: 100 });
        console.log("   Trade Response:", tradeRes.data);

        console.log("✅ All tests passed!");
    } catch (error) {
        console.error("❌ Test failed:", error.response ? error.response.data : error.message);
    }
}

testEndpoints();
