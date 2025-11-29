const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:5001/api/generate-meme-identity', { seed: 'test' });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error Status:', err.response ? err.response.status : 'No response');
        console.error('Error Data:', err.response ? err.response.data : err.message);
    }
}

test();
