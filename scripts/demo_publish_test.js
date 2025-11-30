const axios = require('axios');

const API_URL = 'http://localhost:5001';
const POLICY_ID = 'e68f1cea19752d1292b4be71b7f5d2b3219a15859c028f7454f66cdf';

async function runTest() {
    console.log('🚀 Starting Demo Publish Test...');

    try {
        // 1. Build Proof
        console.log('\n1. Building Proof...');
        const buildRes = await axios.post(`${API_URL}/api/v1/proof/build`, {
            policyId: POLICY_ID,
            analysisHash: 'mock_hash_for_demo', // In real flow, this comes from AI
            rugProbability: 50,
            trustScore: 50,
            timestamp: Math.floor(Date.now() / 1000)
        });
        console.log('✅ Build Success!');
        console.log('Datum:', JSON.stringify(buildRes.data.analysisDatum, null, 2));

        // 2. Get Demo Signed TX
        console.log('\n2. Fetching Demo Signed TX...');
        const demoRes = await axios.get(`${API_URL}/api/v1/proof/demo-signed/${POLICY_ID}`);
        console.log('✅ Fetch Success!');
        console.log('Tx Hash:', demoRes.data.tx_hash);

        // 3. Submit TX
        console.log('\n3. Submitting Transaction...');
        const submitRes = await axios.post(`${API_URL}/api/v1/tx/submit`, {
            signed_tx_hex: demoRes.data.signed_tx_hex
        });
        console.log('✅ Submit Success!');
        console.log('Tx Hash:', submitRes.data.tx_hash);

        console.log('\n🎉 Test Completed Successfully!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response?.data || error.message);
    }
}

runTest();
