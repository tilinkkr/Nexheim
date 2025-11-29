const express = require('express');
const router = express.Router();
const db = require('../services/db');
const rugDetector = require('../services/rugDetector');

/**
 * GET /incident/:policyId
 * Aggregates data for the Incident Sheet
 */
router.get('/:policyId', async (req, res) => {
    const { policyId } = req.params;
    try {
        // 1. Get Token Info
        const token = await db.getTokenByPolicyId(policyId);

        // 2. Get Masumi Summary (latest audit log)
        // We query by policyId because we stored it as tokenId in audit_logs for Masumi analysis
        const logs = await db.getAuditLogs(policyId);
        const masumiLog = logs.find(l => l.action === 'MASUMI_ANALYSIS');
        const masumiSummary = masumiLog ? masumiLog.info : 'No AI analysis available yet.';

        // 3. Get Insider Risk
        // We pass token data if available, or just policyId
        const insiderRiskData = await rugDetector.getRugScore(policyId, token ? token.yaci_data : null);
        const insiderRisk = insiderRiskData.riskScore;

        // 4. Get Votes & Reports
        // If token exists, use its tokenId (which might be policyId or assetId)
        // If token not found, we assume policyId might be the key or we can't get votes
        const voteKey = token ? token.tokenId : policyId;
        const votes = await db.getVote(voteKey);
        const reports = await db.getReports(voteKey);

        // 5. Trust History (Mock for now, or fetch from historical table if exists)
        // We don't have a historical table for trust score yet, so return mock or empty
        const trustHistory = [65, 68, 70, 72, token ? token.trust_score : 50];

        const response = {
            policyId,
            tokenSymbol: token ? token.symbol : 'UNKNOWN',
            trustScore: token ? token.trust_score : 50,
            trustHistory,
            masumiSummary,
            insiderRisk,
            votesSafe: votes.agree,
            votesRisky: votes.disagree,
            reportsCount: reports.length
        };

        res.json(response);
    } catch (err) {
        console.error('Incident Aggregation Error:', err);
        res.status(500).json({ error: 'Failed to fetch incident details' });
    }
});

module.exports = router;
