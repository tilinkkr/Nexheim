/**
 * Masumi AI Agent Integration
 * Sends real token data for AI risk analysis
 */

const axios = require('axios');
const crypto = require('crypto');

const RISK_AGENT_URL = process.env.RISK_AGENT_URL || 'http://localhost:8000';

/**
 * Analyze token using Masumi AI agent
 * @param {object} tokenData - Real token data from fetchRealTokenData
 * @returns {Promise<object>} AI analysis result
 */
async function analyzeWithMasumi(tokenData) {
    console.log(`[MasumiAgent] Starting analysis for: ${tokenData.policyId}`);

    // Build comprehensive context for AI
    const analysisContext = {
        // Token basics
        policyId: tokenData.policyId,
        tokenName: tokenData.metadata?.onchainMetadata?.name || tokenData.assetName || 'Unknown',
        totalSupply: tokenData.metadata?.quantity || '0',

        // Holder analysis
        holderCount: tokenData.holderDistribution?.totalHolders || 0,
        top1HolderPct: tokenData.holderDistribution?.top1HolderPct || 0,
        top5HoldersPct: tokenData.holderDistribution?.top5HoldersPct || 0,
        top10HoldersPct: tokenData.holderDistribution?.top10HoldersPct || 0,
        isHighlyConcentrated: tokenData.holderDistribution?.isHighlyConcentrated || false,

        // Activity metrics
        txLast24h: tokenData.activityMetrics?.txLast24h || 0,
        txLast7d: tokenData.activityMetrics?.txLast7d || 0,
        isActive: tokenData.activityMetrics?.isActive || false,

        // Mint/Burn info
        canMintMore: tokenData.mintBurnSummary?.canMintMore || false,
        hasBurns: tokenData.mintBurnSummary?.hasBurns || false,

        // Data integrity
        dataHash: tokenData.dataHash,
        fetchedAt: tokenData.fetchedAt,
        errors: tokenData.errors
    };

    try {
        // Call Masumi agent
        const response = await axios.post(`${RISK_AGENT_URL}/analyze`, {
            token_context: analysisContext,
            analysis_type: 'comprehensive_risk_assessment'
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`[MasumiAgent] ✓ Analysis complete`);

        return {
            success: true,
            analysis: response.data,
            timestamp: new Date().toISOString()
        };

    } catch (err) {
        console.error(`[MasumiAgent] ✗ Analysis failed: ${err.message}`);

        // Fallback to rule-based analysis
        return generateFallbackAnalysis(analysisContext);
    }
}

/**
 * Generate fallback analysis when AI is unavailable
 */
/**
 * Generate fallback analysis when AI is unavailable
 */
function generateFallbackAnalysis(context) {
    const { score: rugScore, factors } = calculateRugScore(context);

    let explanation = `Analysis for ${context.tokenName}:\n\n`;

    // Holder concentration analysis
    if (context.top1HolderPct > 50) {
        explanation += `🚨 CRITICAL: Top holder owns ${context.top1HolderPct}% of supply - extreme rug risk!\n`;
    } else if (context.top1HolderPct > 30) {
        explanation += `⚠️ WARNING: Top holder owns ${context.top1HolderPct}% - high concentration risk.\n`;
    } else {
        explanation += `✓ Holder distribution looks healthy (top holder: ${context.top1HolderPct}%).\n`;
    }

    // Activity analysis
    if (context.txLast24h === 0) {
        explanation += `⚠️ No transactions in last 24 hours - token may be dead.\n`;
    } else if (context.txLast24h < 5) {
        explanation += `⚡ Low activity (${context.txLast24h} tx/24h) - limited liquidity.\n`;
    } else {
        explanation += `✓ Active trading (${context.txLast24h} tx/24h).\n`;
    }

    // Mint policy analysis
    if (context.canMintMore) {
        explanation += `⚠️ Token can be minted again - supply not fixed!\n`;
    } else {
        explanation += `✓ Fixed supply - no additional minting possible.\n`;
    }

    // Overall recommendation
    if (rugScore > 80) {
        explanation += `\n💀 RECOMMENDATION: DO NOT INVEST - Critical rug pull risk detected.`;
    } else if (rugScore > 60) {
        explanation += `\n🔴 RECOMMENDATION: High risk - only for experienced traders.`;
    } else if (rugScore > 40) {
        explanation += `\n🟠 RECOMMENDATION: Moderate risk - proceed with caution.`;
    } else if (rugScore > 20) {
        explanation += `\n🟡 RECOMMENDATION: Low-moderate risk - standard precautions apply.`;
    } else {
        explanation += `\n🟢 RECOMMENDATION: Relatively safe for meme coin standards.`;
    }

    return {
        success: true,
        analysis: {
            explanation,
            rug_probability: rugScore,
            risk_level: rugScore > 60 ? 'critical' : rugScore > 40 ? 'high' : rugScore > 20 ? 'moderate' : 'low',
            suggested_action: rugScore > 60 ? 'avoid' : rugScore > 40 ? 'extreme_caution' : 'monitor',
            confidence: 0.7,
            method: 'rule_based_fallback',
            risk_factors: factors
        },
        timestamp: new Date().toISOString(),
        fallback: true
    };
}

/**
 * Calculate rug score based on risk factors
 */
function calculateRugScore(context) {
    let score = 0;
    const factors = [];

    // Whale concentration (0-40 points)
    if (context.top1HolderPct > 70) {
        score += 40;
        factors.push({ name: 'Whale Concentration', value: `${context.top1HolderPct}%`, penalty: -40, rule: '> 70% held by top 1' });
    } else if (context.top1HolderPct > 50) {
        score += 30;
        factors.push({ name: 'Whale Concentration', value: `${context.top1HolderPct}%`, penalty: -30, rule: '> 50% held by top 1' });
    } else if (context.top1HolderPct > 30) {
        score += 20;
        factors.push({ name: 'Whale Concentration', value: `${context.top1HolderPct}%`, penalty: -20, rule: '> 30% held by top 1' });
    } else if (context.top1HolderPct > 20) {
        score += 10;
        factors.push({ name: 'Whale Concentration', value: `${context.top1HolderPct}%`, penalty: -10, rule: '> 20% held by top 1' });
    } else {
        factors.push({ name: 'Whale Concentration', value: `${context.top1HolderPct}%`, penalty: 0, rule: 'Safe distribution' });
    }

    // Activity (0-20 points)
    if (context.txLast24h === 0) {
        score += 20;
        factors.push({ name: 'Trading Activity', value: '0 tx/24h', penalty: -20, rule: 'No activity' });
    } else if (context.txLast24h < 5) {
        score += 10;
        factors.push({ name: 'Trading Activity', value: `${context.txLast24h} tx/24h`, penalty: -10, rule: 'Low activity (< 5)' });
    } else {
        factors.push({ name: 'Trading Activity', value: `${context.txLast24h} tx/24h`, penalty: 0, rule: 'Active trading' });
    }

    // Mint policy (0-20 points)
    if (context.canMintMore) {
        score += 20;
        factors.push({ name: 'Mint Policy', value: 'Mutable', penalty: -20, rule: 'Supply can be increased' });
    } else {
        factors.push({ name: 'Mint Policy', value: 'Fixed', penalty: 0, rule: 'Fixed supply' });
    }

    // Holder count (0-20 points)
    if (context.holderCount < 10) {
        score += 20;
        factors.push({ name: 'Holder Count', value: `${context.holderCount}`, penalty: -20, rule: 'Extremely low (< 10)' });
    } else if (context.holderCount < 50) {
        score += 10;
        factors.push({ name: 'Holder Count', value: `${context.holderCount}`, penalty: -10, rule: 'Very low (< 50)' });
    } else if (context.holderCount < 100) {
        score += 5;
        factors.push({ name: 'Holder Count', value: `${context.holderCount}`, penalty: -5, rule: 'Low (< 100)' });
    } else {
        factors.push({ name: 'Holder Count', value: `${context.holderCount}`, penalty: 0, rule: 'Healthy (> 100)' });
    }

    return { score: Math.min(100, score), factors };
}

module.exports = {
    analyzeWithMasumi,
    generateFallbackAnalysis
};
