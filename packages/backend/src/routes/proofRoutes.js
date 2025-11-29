const express = require('express');
const router = express.Router();
const {
    buildAnalysisDatum,
    computeAnalysisHash,
    canonicalSummaryString,
    buildUnsignedTransaction,
    getDemoSignedTx,
    submitTransaction
} = require('../services/proofGenerator');

// POST /api/v1/proof/build
router.post('/proof/build', async (req, res) => {
    try {
        const { policyId, analysisHash, rugProbability, trustScore, timestamp, analyst } = req.body;

        // Validation
        if (!policyId || !analysisHash || rugProbability === undefined || trustScore === undefined || !timestamp) {
            return res.status(400).json({ ok: false, error: 'Missing required fields' });
        }

        // Verify Hash
        const summary = canonicalSummaryString({ policyId, rugProbability, trustScore, timestamp });
        const computedHash = computeAnalysisHash(summary);

        // In a strict mode, we might reject if hashes don't match. 
        // For MVP, we'll log a warning if they differ but proceed with the computed one to ensure consistency.
        if (computedHash !== analysisHash) {
            console.warn(`[ProofRoutes] Hash mismatch! Client: ${analysisHash}, Server: ${computedHash}`);
        }

        const datum = buildAnalysisDatum({
            policyId,
            analysisHash: computedHash,
            rugProbability,
            trustScore,
            timestamp,
            analyst
        });

        // Build Unsigned TX (Mock/Placeholder)
        const scriptAddress = "addr_test1wp..."; // Placeholder script address
        const unsignedCbor = await buildUnsignedTransaction(datum, scriptAddress);

        res.json({
            ok: true,
            unsigned_cbor: unsignedCbor,
            analysisDatum: datum,
            build_meta: {
                script_address: scriptAddress,
                fee_estimate: 200000,
                estimated_size: 500
            }
        });

    } catch (error) {
        console.error('[ProofRoutes] Build error:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// GET /api/v1/proof/demo-signed/:policyId
router.get('/proof/demo-signed/:policyId', (req, res) => {
    const { policyId } = req.params;
    const demoTx = getDemoSignedTx(policyId);

    if (!demoTx) {
        return res.status(404).json({ ok: false, error: 'No demo signed tx found for this policyId' });
    }

    res.json({
        ok: true,
        signed_tx_hex: demoTx.signed_tx_hex,
        tx_hash: demoTx.tx_hash,
        note: "Demo-only signed tx for judges. Do not use in production."
    });
});

// POST /api/v1/tx/submit
router.post('/tx/submit', async (req, res) => {
    try {
        const { signed_tx_hex } = req.body;
        if (!signed_tx_hex) {
            return res.status(400).json({ ok: false, error: 'Missing signed_tx_hex' });
        }

        const result = await submitTransaction(signed_tx_hex);
        res.json({ ok: true, tx_hash: result });

    } catch (error) {
        console.error('[ProofRoutes] Submit error:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;
