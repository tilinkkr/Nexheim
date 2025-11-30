const NodeCache = require('node-cache');

// Cache for 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

/**
 * Rug Probability Meter Service
 * Analyzes on-chain metrics and social signals to compute rug probability
 */

/**
 * Fetch on-chain metrics (mocked)
 * @param {string} policyId 
 * @returns {Promise<Object>}
 */
async function fetchOnchainMetrics(policyId) {
    // Simulate async data fetch with random delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

    return {
        ownerDistribution: {
            top1Holder: Math.random() * 100,
            top10Holders: Math.random() * 100,
            totalHolders: Math.floor(Math.random() * 10000) + 100
        },
        liquidityLocked: Math.random() > 0.5,
        recentMints: Math.floor(Math.random() * 1000),
        recentLargeTransfers: Math.floor(Math.random() * 50),
        auditFlags: Math.floor(Math.random() * 5)
    };
}

/**
 * Fetch social signals (mocked)
 * @param {string} policyId 
 * @returns {Promise<Object>}
 */
async function fetchSocialSignals(policyId) {
    // Simulate async data fetch with random delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

    return {
        mentionVolume: Math.floor(Math.random() * 10000),
        spikeScore: Math.random() // 0..1
    };
}

/**
 * Compute rug probability score from metrics
 * @param {Object} metrics - On-chain metrics
 * @param {Object} social - Social signals
 * @returns {Object} - { score, status, factors }
 */
function computeScore(metrics, social) {
    let score = 50; // Start neutral
    const factors = [];

    // Owner concentration risk
    if (metrics.ownerDistribution.top1Holder > 50) {
        score += 20;
        factors.push('High concentration: Top holder owns >50%');
    } else if (metrics.ownerDistribution.top1Holder > 30) {
        score += 10;
        factors.push('Moderate concentration: Top holder owns >30%');
    } else {
        score -= 10;
        factors.push('Good distribution: Top holder owns <30%');
    }

    // Liquidity lock
    if (!metrics.liquidityLocked) {
        score += 15;
        factors.push('Liquidity not locked - high risk');
    } else {
        score -= 15;
        factors.push('Liquidity locked - safer');
    }

    // Recent minting activity
    if (metrics.recentMints > 500) {
        score += 10;
        factors.push('High recent minting activity');
    }

    // Large transfers
    if (metrics.recentLargeTransfers > 20) {
        score += 10;
        factors.push('Multiple large transfers detected');
    }

    // Audit flags
    if (metrics.auditFlags > 2) {
        score += 15;
        factors.push(`${metrics.auditFlags} audit flags raised`);
    }

    // Social spike (potential pump & dump)
    if (social.spikeScore > 0.7) {
        score += 10;
        factors.push('Unusual social media spike detected');
    }

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine status
    let status;
    if (score < 30) {
        status = 'low';
    } else if (score < 70) {
        status = 'medium';
    } else {
        status = 'high';
    }

    return { score, status, factors };
}

/**
 * Get rug probability for a token
 * @param {string} policyId - Token policy ID
 * @param {Object} options - { timeout: number }
 * @returns {Promise<Object>}
 */
async function getRugProbability(policyId, options = {}) {
    const timeout = options.timeout || 7000;

    try {
        console.log(`[RUG-METER] Analyzing ${policyId}`);

        // Check cache
        const cached = cache.get(`rug_${policyId}`);
        if (cached) {
            console.log(`[RUG-METER] Cache hit for ${policyId}`);
            return { ...cached, cached: true };
        }

        // Fetch data with timeout protection
        const dataPromise = Promise.all([
            fetchOnchainMetrics(policyId),
            fetchSocialSignals(policyId)
        ]);

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        );

        const [metrics, social] = await Promise.race([dataPromise, timeoutPromise]);

        // Compute score
        const { score, status, factors } = computeScore(metrics, social);

        const probability = score / 100;

        const result = {
            policyId,
            probability,
            score,
            status,
            factors,
            explanation: `Rug probability: ${status.toUpperCase()} (${score}/100). ${factors.length} risk factors analyzed.`,
            metrics: {
                ownerConcentration: metrics.ownerDistribution.top1Holder.toFixed(2) + '%',
                liquidityLocked: metrics.liquidityLocked,
                recentActivity: {
                    mints: metrics.recentMints,
                    largeTransfers: metrics.recentLargeTransfers
                },
                auditFlags: metrics.auditFlags
            },
            social: {
                mentionVolume: social.mentionVolume,
                spikeScore: social.spikeScore.toFixed(2)
            },
            timestamp: Date.now(),
            cached: false
        };

        // Cache result
        cache.set(`rug_${policyId}`, result);
        console.log(`[RUG-METER] Analysis complete for ${policyId}: ${status} risk (${score}/100)`);

        return result;

    } catch (error) {
        console.error(`[RUG-METER] Error analyzing ${policyId}:`, error.message);

        // Return fallback - do not throw
        return {
            policyId,
            probability: 0.5,
            score: 50,
            status: 'unknown',
            factors: ['Data unavailable'],
            explanation: 'Fallback: data unavailable',
            error: error.message,
            timestamp: Date.now(),
            cached: false
        };
    }
}

module.exports = {
    getRugProbability
};
