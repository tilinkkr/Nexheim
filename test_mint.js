const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:5001/api/simulate/mint', {
            name: "TestToken",
            symbol: "TST",
            creator: "addr_test1vp4l7k3a65n8q2d5f9j0h1g4s7d8f5g2h6j9k"
        });
        console.log('Success:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error Status:', err.response ? err.response.status : 'No response');
        console.error('Error Data:', err.response ? err.response.data : err.message);
    }
}

test();
