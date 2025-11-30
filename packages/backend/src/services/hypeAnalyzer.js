const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 });

function randomInt(max) { return Math.floor(Math.random() * max); }

async function fetchSocialSignalsMock(policyId, windowStr) {
    // Generate mock counts / scores
    return {
        twitter: randomInt(80),
        reddit: randomInt(30),
        google_trends: randomInt(20),
        telegram: randomInt(25)
    };
}

async function fetchPriceChangeMock(policyId, windowStr) {
    // Mock price change between -0.05 and +0.05
    const r = (Math.random() - 0.5) * 0.1;
    return Number(r.toFixed(4));
}

function computeHypeScore(breakdown) {
    // simple weighted sum
    const weights = { twitter: 0.5, reddit: 0.2, google_trends: 0.15, telegram: 0.15 };
    let sum = 0;
    let totalW = 0;
    for (const k of Object.keys(weights)) {
        const w = weights[k];
        sum += (breakdown[k] || 0) * w;
        totalW += w * 100; // assume scale 0..100
    }
    const score = Math.round((sum / (totalW || 1)) * 100);
    return Math.max(0, Math.min(100, score));
}

async function getHypeRatio(policyId, opts = {}) {
    const cacheKey = `hype:${policyId}:${opts.window || '60m'}`;
    const cached = cache.get(cacheKey);
    if (cached && !opts.force) return { ...cached, cached: true };

    const windowStr = opts.window || '60m';
    const breakdown = await fetchSocialSignalsMock(policyId, windowStr);
    const priceChange = await fetchPriceChangeMock(policyId, windowStr);
    const hypeScore = computeHypeScore(breakdown);
    const epsilon = 0.1; // avoid divide by zero when converting priceChange*100
    const ratio = Number((hypeScore / (Math.abs(priceChange * 100) + epsilon)).toFixed(2));
    const status = ratio > 20 ? 'overhyped' : ratio < 2 ? 'whale-lurk' : 'balanced';

    const result = {
        policyId,
        tokenName: opts.tokenName || null,
        window: windowStr,
        hypeScore,
        priceChange,
        ratio,
        status,
        breakdown,
        explanation: `${hypeScore} hype vs ${(priceChange * 100).toFixed(2)}% price change → ${status}`,
        timestamp: Date.now(),
        cached: false
    };
    cache.set(cacheKey, result);
    return result;
}

module.exports = { getHypeRatio };
