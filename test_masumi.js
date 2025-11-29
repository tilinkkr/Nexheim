const axios = require('axios');

async function test() {
    const policyId = "policyb6wp7qaga7w";
    console.log(`Testing Masumi Risk Analysis for policy: ${policyId}`);
    try {
        const res = await axios.post(`http://localhost:5001/risk/${policyId}/ask-masumi`);
        console.log('Success:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error Status:', err.response ? err.response.status : 'No response');
        console.error('Error Data:', err.response ? err.response.data : err.message);
    }
}

test();
