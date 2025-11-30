const express = require('express');
const router = express.Router();
const { getRugProbability } = require('../services/rugMeter');

console.log('[RISK-ROUTES] Risk routes module loaded');

/**
 * GET /api/memecoins/:policyId/rug-probability
 * Get rug probability analysis for a token
 * Query params:
 *  - force=true to bypass cache
 */
router.get('/memecoins/:policyId/rug-probability', async (req, res) => {
    const { policyId } = req.params;
    const force = req.query.force === 'true';

    console.log(`[RISK-ROUTES] Rug probability request for ${policyId}, force=${force}`);

    try {
        const options = force ? { timeout: 7000, force: true } : {};
        const result = await getRugProbability(policyId, options);

        // If force=true, bypass cache by not using cached result
        if (force && result.cached) {
            console.log(`[RISK-ROUTES] Force refresh requested, fetching fresh data`);
            // The service should handle this, but we can log it
        }

        res.json(result);
        console.log(`[RISK-ROUTES] Rug probability response sent for ${policyId}: ${result.status} (${result.score}/100)`);

    } catch (error) {
        console.error(`[RISK-ROUTES] Error processing rug probability for ${policyId}:`, error.message);
        res.status(500).json({
            error: 'rug-probability-failed',
            details: error.message,
            policyId
        });
    }
});

module.exports = router;
