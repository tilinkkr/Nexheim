/**
 * Real Cardano Token Data Fetcher
 * Fetches on-chain data from Blockfrost API (Preprod testnet)
 */

const axios = require('axios');
const crypto = require('crypto');

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY_PREPROD;
const BLOCKFROST_BASE = 'https://cardano-preprod.blockfrost.io/api/v0';

const blockfrostHeaders = {
    'project_id': BLOCKFROST_API_KEY
};

/**
 * Fetch complete token data from Cardano blockchain
 * @param {string} policyId - Token policy ID
 * @param {string} assetName - Asset name (hex encoded, optional)
 * @returns {Promise<object>} Complete token data
 */
async function fetchRealTokenData(policyId, assetName = '') {
    const assetId = assetName ? `${policyId}${assetName}` : policyId;

    console.log(`[TokenFetcher] Fetching real data for: ${policyId}`);

    const results = {
        fetchedAt: new Date().toISOString(),
        policyId,
        assetName,
        assetId,
        metadata: null,
        holders: [],
        holderDistribution: null,
        transactions: [],
        activityMetrics: null,
        mintBurnHistory: [],
        mintBurnSummary: null,
        policyScript: null,
        errors: []
    };

    // 1. Fetch Asset Metadata
    try {
        const assetRes = await axios.get(
            `${BLOCKFROST_BASE}/assets/${assetId}`,
            { headers: blockfrostHeaders }
        );
        results.metadata = {
            name: assetRes.data.asset_name,
            fingerprint: assetRes.data.fingerprint,
            quantity: assetRes.data.quantity,
            initialMintTxHash: assetRes.data.initial_mint_tx_hash,
            mintOrBurnCount: assetRes.data.mint_or_burn_count,
            onchainMetadata: assetRes.data.onchain_metadata,
            metadata: assetRes.data.metadata
        };
        console.log(`[TokenFetcher] ✓ Metadata fetched`);
    } catch (err) {
        results.errors.push({ step: 'metadata', error: err.message });
        console.log(`[TokenFetcher] ✗ Metadata failed: ${err.message}`);
    }

    // 2. Fetch Policy Script Info
    try {
        const policyRes = await axios.get(
            `${BLOCKFROST_BASE}/scripts/${policyId}`,
            { headers: blockfrostHeaders }
        );
        results.policyScript = {
            type: policyRes.data.type,
            serialisedSize: policyRes.data.serialised_size
        };
        console.log(`[TokenFetcher] ✓ Policy script fetched`);
    } catch (err) {
        results.errors.push({ step: 'policyScript', error: err.message });
    }

    // 3. Fetch Top Holders
    try {
        const holdersRes = await axios.get(
            `${BLOCKFROST_BASE}/assets/${assetId}/addresses`,
            { headers: blockfrostHeaders, params: { count: 20, order: 'desc' } }
        );

        const totalQuantity = BigInt(results.metadata?.quantity || '0');

        results.holders = holdersRes.data.map((h, index) => {
            const quantity = BigInt(h.quantity);
            const percentage = totalQuantity > 0n
                ? Number((quantity * 10000n) / totalQuantity) / 100
                : 0;
            return {
                rank: index + 1,
                address: h.address,
                quantity: h.quantity,
                percentage: percentage.toFixed(2)
            };
        });

        // Calculate distribution metrics
        const top1Pct = parseFloat(results.holders[0]?.percentage || 0);
        const top5Pct = results.holders.slice(0, 5).reduce((sum, h) => sum + parseFloat(h.percentage), 0);
        const top10Pct = results.holders.slice(0, 10).reduce((sum, h) => sum + parseFloat(h.percentage), 0);

        results.holderDistribution = {
            totalHolders: holdersRes.data.length,
            top1HolderPct: top1Pct,
            top5HoldersPct: top5Pct,
            top10HoldersPct: top10Pct,
            isHighlyConcentrated: top1Pct > 50 || top5Pct > 80
        };

        console.log(`[TokenFetcher] ✓ ${results.holders.length} holders fetched`);
    } catch (err) {
        results.errors.push({ step: 'holders', error: err.message });
    }

    // 4. Fetch Recent Transactions
    try {
        const txRes = await axios.get(
            `${BLOCKFROST_BASE}/assets/${assetId}/transactions`,
            { headers: blockfrostHeaders, params: { count: 50, order: 'desc' } }
        );

        results.transactions = txRes.data.map(tx => ({
            txHash: tx.tx_hash,
            txIndex: tx.tx_index,
            blockHeight: tx.block_height,
            blockTime: tx.block_time
        }));

        // Calculate activity metrics
        const now = Math.floor(Date.now() / 1000);
        const last24h = results.transactions.filter(tx => now - tx.blockTime < 86400).length;
        const last7d = results.transactions.filter(tx => now - tx.blockTime < 604800).length;

        results.activityMetrics = {
            totalTxFetched: results.transactions.length,
            txLast24h: last24h,
            txLast7d: last7d,
            isActive: last24h > 5,
            lastTxTime: results.transactions[0]?.blockTime
                ? new Date(results.transactions[0].blockTime * 1000).toISOString()
                : null
        };

        console.log(`[TokenFetcher] ✓ ${results.transactions.length} transactions fetched`);
    } catch (err) {
        results.errors.push({ step: 'transactions', error: err.message });
    }

    // 5. Fetch Mint/Burn History
    try {
        const historyRes = await axios.get(
            `${BLOCKFROST_BASE}/assets/${assetId}/history`,
            { headers: blockfrostHeaders, params: { count: 20, order: 'desc' } }
        );

        results.mintBurnHistory = historyRes.data.map(event => ({
            txHash: event.tx_hash,
            action: event.action,
            amount: event.amount
        }));

        const mintEvents = results.mintBurnHistory.filter(e => e.action === 'minted');
        const burnEvents = results.mintBurnHistory.filter(e => e.action === 'burned');

        results.mintBurnSummary = {
            totalMints: mintEvents.length,
            totalBurns: burnEvents.length,
            canMintMore: mintEvents.length > 1,
            hasBurns: burnEvents.length > 0
        };

        console.log(`[TokenFetcher] ✓ Mint/burn history fetched`);
    } catch (err) {
        results.errors.push({ step: 'mintBurnHistory', error: err.message });
    }

    // 6. Generate data hash for integrity
    const dataString = JSON.stringify({
        policyId: results.policyId,
        quantity: results.metadata?.quantity,
        holders: results.holders.slice(0, 5).map(h => h.address),
        txCount: results.transactions.length,
        fetchedAt: results.fetchedAt
    });
    results.dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

    console.log(`[TokenFetcher] ✓ Complete. Data hash: ${results.dataHash.slice(0, 16)}...`);
    console.log(`[TokenFetcher] Errors: ${results.errors.length}`);

    return results;
}

/**
 * Check if Blockfrost API is configured
 */
function isConfigured() {
    return !!BLOCKFROST_API_KEY;
}

module.exports = {
    fetchRealTokenData,
    isConfigured
};
