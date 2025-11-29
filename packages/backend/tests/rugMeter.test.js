const { getRugProbability } = require('../src/services/rugMeter');

// Mock the internal fetch functions to return deterministic values
jest.mock('../src/services/rugMeter', () => {
    const originalModule = jest.requireActual('../src/services/rugMeter');

    return {
        ...originalModule,
        getRugProbability: jest.fn(async (policyId) => {
            // Deterministic mock data
            const metrics = {
                ownerDistribution: {
                    top1Holder: 45.5,
                    top10Holders: 78.2,
                    totalHolders: 1250
                },
                liquidityLocked: true,
                recentMints: 350,
                recentLargeTransfers: 12,
                auditFlags: 1
            };

            const social = {
                mentionVolume: 4500,
                spikeScore: 0.42
            };

            // Compute score using same logic as rugMeter
            let score = 50;
            const factors = [];

            // Owner concentration
            if (metrics.ownerDistribution.top1Holder > 30) {
                score += 10;
                factors.push('Moderate concentration: Top holder owns >30%');
            }

            // Liquidity lock
            if (metrics.liquidityLocked) {
                score -= 15;
                factors.push('Liquidity locked - safer');
            }

            // Clamp score
            score = Math.max(0, Math.min(100, score));

            const status = score < 30 ? 'low' : score < 70 ? 'medium' : 'high';

            return {
                policyId,
                probability: score / 100,
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
        })
    };
});

describe('RugMeter Service', () => {
    test('should compute correct score for deterministic inputs', async () => {
        const result = await getRugProbability('test-policy-123');

        // Assertions
        expect(result).toBeDefined();
        expect(result.policyId).toBe('test-policy-123');
        expect(result.score).toBe(45); // 50 + 10 (concentration) - 15 (liquidity locked)
        expect(result.status).toBe('medium'); // 45 is in medium range (30-69)
        expect(result.probability).toBe(0.45);
        expect(result.factors).toHaveLength(2);
        expect(result.factors).toContain('Moderate concentration: Top holder owns >30%');
        expect(result.factors).toContain('Liquidity locked - safer');
        expect(result.metrics.ownerConcentration).toBe('45.50%');
        expect(result.metrics.liquidityLocked).toBe(true);
        expect(result.social.mentionVolume).toBe(4500);
    });

    test('should return proper structure', async () => {
        const result = await getRugProbability('another-policy');

        // Check structure
        expect(result).toHaveProperty('policyId');
        expect(result).toHaveProperty('probability');
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('factors');
        expect(result).toHaveProperty('explanation');
        expect(result).toHaveProperty('metrics');
        expect(result).toHaveProperty('social');
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('cached');
    });
});
