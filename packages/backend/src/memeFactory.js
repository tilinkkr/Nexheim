// Meme Coin Factory - Auto-generate realistic meme coins with varied risk profiles

const PREFIXES = [
    'Safe', 'Moon', 'Doge', 'Shib', 'Pepe', 'Wojak', 'Chad', 'Baby',
    'Mini', 'Mega', 'Ultra', 'Super', 'Hyper', 'Turbo', 'Rocket', 'Elon',
    'Floki', 'Inu', 'Akita', 'Kishu', 'Saitama', 'Hoge', 'Meme', 'Ape'
];

const SUFFIXES = [
    'Moon', 'Rocket', 'Inu', 'Coin', 'Token', 'Finance', 'Swap', 'Protocol',
    'DAO', 'Vault', 'Safe', 'Doge', 'Shiba', 'Pepe', 'Chad', 'Wojak',
    'Lambo', 'Diamond', 'Hands', 'HODL', 'Pump', 'Gem', 'Gold', 'Star'
];

const RISK_PROFILES = {
    safe: {
        probability: 0.30,
        trustScoreRange: [75, 95],
        liquidityRange: [50000, 500000],
        holdersRange: [500, 5000],
        whalePercentRange: [5, 15],
        flags: []
    },
    medium: {
        probability: 0.30,
        trustScoreRange: [50, 74],
        liquidityRange: [10000, 50000],
        holdersRange: [100, 500],
        whalePercentRange: [15, 30],
        flags: ['low_liquidity']
    },
    risky: {
        probability: 0.25,
        trustScoreRange: [25, 49],
        liquidityRange: [1000, 10000],
        holdersRange: [20, 100],
        whalePercentRange: [30, 50],
        flags: ['whale_dominance', 'low_liquidity']
    },
    scam: {
        probability: 0.15,
        trustScoreRange: [0, 24],
        liquidityRange: [100, 1000],
        holdersRange: [5, 20],
        whalePercentRange: [50, 90],
        flags: ['honeypot_risk', 'whale_dominance', 'suspicious_contract']
    }
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName() {
    const prefix = randomElement(PREFIXES);
    const suffix = randomElement(SUFFIXES);

    // Avoid duplicate words
    if (prefix === suffix) {
        return generateRandomName();
    }

    return `${prefix}${suffix}`;
}

function selectRiskProfile() {
    const rand = Math.random();
    let cumulative = 0;

    for (const [profile, config] of Object.entries(RISK_PROFILES)) {
        cumulative += config.probability;
        if (rand <= cumulative) {
            return { profile, config };
        }
    }

    return { profile: 'medium', config: RISK_PROFILES.medium };
}

function generateMemeCoin() {
    const name = generateRandomName();
    const symbol = name.substring(0, 4).toUpperCase() + (Math.random() > 0.5 ? 'X' : '');
    const { profile, config } = selectRiskProfile();

    const tokenId = 'meme_' + Math.random().toString(36).substring(2, 12);
    const policyId = 'policy' + Math.random().toString(36).substring(2, 18);

    const trustScore = randomInt(...config.trustScoreRange);
    const liquidity = randomInt(...config.liquidityRange);
    const holders = randomInt(...config.holdersRange);
    const whalePercent = randomInt(...config.whalePercentRange);

    // Generate top holders
    const topHolders = [];
    const holderCount = Math.min(3, holders);
    for (let i = 0; i < holderCount; i++) {
        topHolders.push({
            address: `addr_test1...${Math.random().toString(36).substring(2, 5)}`,
            amount: String(randomInt(1000, 10000))
        });
    }

    return {
        tokenId,
        name,
        symbol,
        trust_score: trustScore,
        policyId,
        riskProfile: profile,
        flags: config.flags,
        yaci_data: {
            holders_snapshot: {
                total_holders: holders,
                whale_percent: whalePercent,
                top_holders: topHolders
            },
            liquidity_info: {
                dex: randomElement(['Minswap', 'SundaeSwap', 'MuesliSwap', 'WingRiders']),
                pool_url: '#',
                total_liquidity_ada: liquidity
            },
            is_simulated: true,
            source: 'meme_factory'
        },
        created_at: new Date().toISOString(),
        source: 'meme_factory',
        isDisputed: profile === 'scam' || profile === 'risky'
    };
}

function generateBatch(count = 5) {
    const coins = [];
    for (let i = 0; i < count; i++) {
        coins.push(generateMemeCoin());
    }
    return coins;
}

module.exports = {
    generateMemeCoin,
    generateBatch
};
