export interface HypeRatioData {
    policyId: string;
    tokenName: string;
    hypeScore: number;
    priceChange: string;
    volume24h: number;
    currentPrice: string;
    ratio: string;
    status: 'overhyped' | 'balanced' | 'undervalued' | 'stagnant' | 'cautious';
    risk: 'high' | 'medium' | 'low' | 'opportunity';
    message: string;
    explanation: string;
    breakdown: {
        socialMentions: number;
        searchTrends: number;
        communityActivity: number;
    };
    timestamp: number;
    cached: boolean;
}
