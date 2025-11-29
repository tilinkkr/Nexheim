const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const POLICY_ID = 'policy_test_123'; // Using a dummy policy ID

async function testHypeRatio() {
    try {
        console.log(`Testing Hype Ratio for policy: ${POLICY_ID}`);
        const response = await axios.get(`${API_URL}/tokens/${POLICY_ID}/hype-ratio`);

        console.log('✅ Success! Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

testHypeRatio();
