const { generateMemeCoin } = require('./src/memeFactory');

console.log("Generating 5 meme coins to verify fields...");
const coins = [];
for (let i = 0; i < 5; i++) {
    coins.push(generateMemeCoin());
}

const sample = coins[0];
console.log("Sample Coin:", JSON.stringify(sample, null, 2));

const hasPrice = coins.every(c => c.price && !isNaN(parseFloat(c.price)));
const hasChange = coins.every(c => c.priceChange24h && !isNaN(parseFloat(c.priceChange24h)));
const hasTrustScore = coins.every(c => c.trustScore !== undefined);

if (hasPrice && hasChange && hasTrustScore) {
    console.log("✅ VERIFICATION SUCCESS: All coins have price, priceChange24h, and trustScore.");
} else {
    console.error("❌ VERIFICATION FAILED: Missing fields.");
    console.error("Has Price:", hasPrice);
    console.error("Has Change:", hasChange);
    console.error("Has TrustScore:", hasTrustScore);
    process.exit(1);
}
