// Simulated DEX Service (Minswap/SundaeSwap Mock)

const MOCK_POOLS = {
    'tok_': { price: 1.5, liquidity: 500000 }, // Default fallback
};

function getQuote(tokenId, amount, type) {
    // Simulate price impact and fees
    const pool = MOCK_POOLS[tokenId] || { price: 1.0 + Math.random(), liquidity: 100000 };
    const price = pool.price;
    const fee = amount * 0.003; // 0.3% fee

    let estimatedOutput;
    if (type === 'buy') {
        estimatedOutput = (amount / price) * 0.997; // ADA -> Token
    } else {
        estimatedOutput = (amount * price) * 0.997; // Token -> ADA
    }

    return {
        price: price.toFixed(4),
        fee: fee.toFixed(4),
        estimatedOutput: estimatedOutput.toFixed(4),
        priceImpact: (amount / pool.liquidity * 100).toFixed(2) + '%'
    };
}

module.exports = { getQuote };
