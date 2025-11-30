export interface IncidentDetails {
    policyId: string;
    tokenSymbol: string;
    trustScore: number;
    trustHistory: number[]; // last N points for sparkline
    masumiSummary: string;
    insiderRisk: number; // 0–100
    votesSafe: number;
    votesRisky: number;
    reportsCount: number;
}
