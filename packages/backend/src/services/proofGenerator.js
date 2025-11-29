const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load demo signed txs
let demoSignedTxs = {};
try {
    const demoPath = path.join(__dirname, '../../config/demo_signed_txs.json');
    if (fs.existsSync(demoPath)) {
        demoSignedTxs = JSON.parse(fs.readFileSync(demoPath, 'utf8'));
    }
} catch (e) {
    console.warn('[ProofGenerator] Could not load demo_signed_txs.json', e.message);
}

/**
 * Canonical summary string for hash computation
 */
function canonicalSummaryString({ policyId, rugProbability, trustScore, timestamp }) {
    // canonical order — MUST be stable
    return `policyId=${policyId}|rug=${rugProbability}|trust=${trustScore}|ts=${timestamp}|v=1`;
}

/**
 * Compute SHA-256 hash of the summary string
 */
function computeAnalysisHash(summaryString) {
    return crypto.createHash('sha256').update(summaryString).digest('hex');
}

/**
 * Build Analysis Datum (AIKEN style JSON)
 */
function buildAnalysisDatum({ policyId, analysisHash, rugProbability, trustScore, timestamp, analyst }) {
    return {
        policy_id: policyId,
        analysis_hash: analysisHash,
        rug_probability: rugProbability,
        trust_score: trustScore,
        timestamp: timestamp,
        analyst: analyst || 'nexguard_verifier_01',
        version: '1.0.0'
    };
}

/**
 * Build Unsigned Transaction (Mock/Placeholder for MVP)
 * In a full implementation, this would use Lucid or CSL to build the actual CBOR.
 */
async function buildUnsignedTransaction(analysisDatum, scriptAddress) {
    // MVP: Return a placeholder CBOR string. 
    // The frontend will likely use the "Demo Signed TX" flow for the hackathon.
    // If we needed real CBOR, we'd need to install lucid-cardano here.

    // This is a valid-looking but non-functional CBOR hex for demo purposes if needed
    // In reality, the frontend should use the demo signed tx.
    return "84a30081825820" + analysisDatum.analysis_hash + "00018182583900" + analysisDatum.policy_id + "821a0016e360a0021a0002b573030a";
}

/**
 * Get Demo Signed Transaction
 */
function getDemoSignedTx(policyId) {
    return demoSignedTxs[policyId] || null;
}

/**
 * Submit Transaction to Blockfrost
 */
async function submitTransaction(signedTxHex) {
    const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY_PREPROD;
    const BLOCKFROST_BASE = 'https://cardano-preprod.blockfrost.io/api/v0';

    try {
        const response = await axios.post(
            `${BLOCKFROST_BASE}/tx/submit`,
            Buffer.from(signedTxHex, 'hex'),
            {
                headers: {
                    'project_id': BLOCKFROST_API_KEY,
                    'Content-Type': 'application/cbor'
                }
            }
        );
        return response.data; // { type: "cbor", id: "..." } (id is the tx_hash)
    } catch (error) {
        console.error('[ProofGenerator] Submit error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
}

module.exports = {
    canonicalSummaryString,
    computeAnalysisHash,
    buildAnalysisDatum,
    buildUnsignedTransaction,
    getDemoSignedTx,
    submitTransaction
};
