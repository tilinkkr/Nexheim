const NodeCache = require('node-cache');
const db = require('./db');

// Cache for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

class RugDetector {
    /**
     * Calculate Rug Pull Probability Score (0-100)
     * Higher score = Higher risk of rug pull
     */
    async getRugScore(policyId, tokenData) {
        const cacheKey = `rug_${policyId}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        // 1. Liquidity Analysis (30%)
        const liquidityScore = this.analyzeLiquidity(tokenData);

        // 2. Holder Distribution (30%)
        const holderScore = this.analyzeHolders(tokenData);

        // 3. Mint/Burn Authority (20%)
        const authorityScore = this.analyzeAuthority(tokenData);

        // 4. Social Sentiment (20%)
        // For now, we simulate this or use data passed in
        const socialScore = Math.floor(Math.random() * 20);

        // Weighted Total
        const totalRisk =
            (liquidityScore * 0.3) +
            (holderScore * 0.3) +
            (authorityScore * 0.2) +
            (socialScore * 0.2);

        const result = {
            policyId,
            riskScore: Math.round(totalRisk),
            riskLevel: this.getRiskLevel(totalRisk),
            breakdown: {
                liquidityRisk: liquidityScore,
                holderRisk: holderScore,
                authorityRisk: authorityScore,
                socialRisk: socialScore
            },
            warnings: this.generateWarnings(liquidityScore, holderScore, authorityScore),
            timestamp: Date.now()
        };

        cache.set(cacheKey, result);
        return result;
    }

    analyzeLiquidity(data) {
        // Low liquidity = High Risk
        // Mock logic: if no data, assume medium risk
        if (!data || !data.liquidity) return 50;

        const liquidity = data.liquidity;
        if (liquidity < 1000) return 100; // Very high risk
        if (liquidity < 10000) return 70;
        if (liquidity < 50000) return 40;
        return 10; // Low risk
    }

    analyzeHolders(data) {
        // High concentration = High Risk
        // Mock logic
        if (!data || !data.top10Holdings) return 50;

        const top10 = data.top10Holdings; // Percentage
        if (top10 > 80) return 90;
        if (top10 > 50) return 60;
        if (top10 > 20) return 30;
        return 10;
    }

    analyzeAuthority(data) {
        // Can mint more? Mutable metadata?
        // Mock logic
        if (data && data.canMint) return 80;
        return 20;
    }

    getRiskLevel(score) {
        if (score >= 75) return 'CRITICAL';
        if (score >= 50) return 'HIGH';
        if (score >= 25) return 'MEDIUM';
        return 'LOW';
    }

    generateWarnings(liquidity, holders, authority) {
        const warnings = [];
        if (liquidity > 60) warnings.push("Low Liquidity: Hard to sell without slippage.");
        if (holders > 60) warnings.push("Whale Dominance: Top holders control supply.");
        if (authority > 60) warnings.push("Mint Authority: Owner can mint more tokens.");
        return warnings;
    }
}

module.exports = new RugDetector();
