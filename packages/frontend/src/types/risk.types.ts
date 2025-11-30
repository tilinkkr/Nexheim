export interface RugProbabilityData {
    policyId: string;
    probability: number;
    score: number;
    status: 'low' | 'medium' | 'high' | 'unknown';
    factors: string[];
    explanation: string;
    metrics: {
        ownerConcentration: string;
        liquidityLocked: boolean;
        recentActivity: {
            mints: number;
            largeTransfers: number;
        };
        auditFlags: number;
    };
    social: {
        mentionVolume: number;
        spikeScore: string;
    };
    timestamp: number;
    cached: boolean;
    error?: string;
}
