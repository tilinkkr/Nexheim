const express = require('express');
const router = express.Router();
let hypeAnalyzer;
try {
    hypeAnalyzer = require('../services/hypeAnalyzer');
} catch (e) {
    console.error('Failed to require hypeAnalyzer', e);
    hypeAnalyzer = { getHypeRatio: async (policyId) => ({ policyId, error: 'hypeAnalyzer-missing' }) };
}

router.get('/tokens/:policyId/hype-ratio', async (req, res) => {
    const { policyId } = req.params;
    const windowStr = req.query.window || '60m';
    try {
        const result = await hypeAnalyzer.getHypeRatio(policyId, { window: windowStr, force: req.query.force === 'true' });
        res.json(result);
    } catch (err) {
        console.error('[HYPE-ROUTES] error', err && err.stack ? err.stack : err);
        res.status(500).json({ error: 'hype-failed' });
    }
});

module.exports = router;
