const NodeCache = require('node-cache');
const db = require('./db');

// Cache for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

class HypeAnalyzer {
    /**
     * Main entry point: Calculate hype ratio for a token
     */
    async getHypeRatio(policyId, tokenName) {
        try {
            // Check cache first
            const cached = this.getCachedRatio(policyId);
            if (cached) {
                console.log(`[HypeAnalyzer] Cache hit for ${policyId}`);
                return cached;
            }

            console.log(`[HypeAnalyzer] Calculating fresh ratio for ${policyId}`);

            // Calculate hype score
            const hypeData = await this.calculateHypeScore(policyId, tokenName);

            // Get price change
            const priceData = await this.getPriceChange(policyId);

            // Analyze ratio
            const analysis = this.analyzeRatio(hypeData.hypeScore, priceData.change24h);

            // Compile result
            const result = {
                policyId,
                tokenName,
                hypeScore: hypeData.hypeScore,
                priceChange: priceData.change24h,
                volume24h: priceData.volume24h,
                ratio: analysis.ratio,
                status: analysis.status,
                risk: analysis.risk,
                message: analysis.message,
                explanation: analysis.explanation,
                breakdown: {
                    socialMentions: hypeData.socialMentions,
                    searchTrends: hypeData.searchTrends,
                    communityActivity: hypeData.communityActivity
                },
                timestamp: Date.now()
            };

            // Cache result
            this.cacheRatio(policyId, result);

            // Save to database
            this.saveToDatabase(result);

            return result;

        } catch (error) {
            console.error('[HypeAnalyzer] Error:', error);
            throw error;
        }
    }

    /**
     * Calculate composite hype score (0-100)
     */
    async calculateHypeScore(policyId, tokenName) {
        const socialMentions = await this.getSocialMentions(tokenName);
        const searchTrends = await this.getSearchTrends(tokenName);
        const communityActivity = await this.getCommunityActivity(policyId);

        const hypeScore = this.computeHypeScore({
            socialMentions,
            searchTrends,
            communityActivity
        });

        return {
            hypeScore,
            socialMentions,
            searchTrends,
            communityActivity
        };
    }

    /**
     * Get social media mentions (mock for now)
     */
    async getSocialMentions(tokenName) {
        // TODO: Integrate Twitter API, Reddit API
        // For now, generate realistic mock data
        const baseMentions = Math.floor(Math.random() * 1000);

        // Boost if token name contains meme keywords
        const memeKeywords = ['doge', 'pepe', 'shib', 'moon', 'inu'];
        const isMeme = memeKeywords.some(kw => (tokenName || '').toLowerCase().includes(kw));

        return isMeme ? baseMentions * 2 : baseMentions;
    }

    /**
     * Get search trends (mock for now)
     */
    async getSearchTrends(tokenName) {
        // TODO: Integrate Google Trends API
        return Math.floor(Math.random() * 100);
    }

    /**
     * Get community activity from our database
     */
    async getCommunityActivity(policyId) {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT COUNT(*) as count 
        FROM audit_logs 
        WHERE tokenId = ? 
      `;
            // Note: Using audit_logs instead of audit table as per db.js schema
            // Also assuming tokenId in audit_logs maps to policyId or we need to look up tokenId by policyId first.
            // In this system, it seems tokenId and policyId are distinct but related. 
            // Let's assume for now we query by policyId if possible, or we need to resolve it.
            // However, db.js shows audit_logs uses tokenId. 
            // Let's try to find the token first to get its tokenId from policyId if needed.
            // But getHypeRatio receives policyId. 
            // Let's assume for this mock implementation we query audit_logs. 
            // Wait, db.js has `audit_logs` table. 
            // The user prompt used `audit` table but db.js has `audit_logs`. I will use `audit_logs`.

            // We need to match policyId to tokenId to query audit_logs correctly.
            // Or we can query tokens table to get tokenId from policyId.

            db.getTokenByPolicyId(policyId).then(token => {
                if (!token) {
                    resolve(0);
                    return;
                }
                const sql = `SELECT COUNT(*) as count FROM audit_logs WHERE tokenId = ?`;
                // We can't use db object directly if it's not exposing the raw db object.
                // db.js exports functions. I need to add a raw query function or use what's available.
                // db.js exports `getAuditLogs`. I can use that and count.

                db.getAuditLogs(token.tokenId).then(logs => {
                    resolve(logs.length);
                }).catch(err => {
                    console.error('[HypeAnalyzer] DB error:', err);
                    resolve(0);
                });
            }).catch(() => resolve(0));
        });
    }

    /**
     * Compute weighted hype score
     */
    computeHypeScore(data) {
        const weights = {
            socialMentions: 0.5,    // 50% weight
            searchTrends: 0.3,      // 30% weight
            communityActivity: 0.2  // 20% weight
        };

        // Normalize to 0-100 scale
        const maxValues = {
            socialMentions: 1000,
            searchTrends: 100,
            communityActivity: 50
        };

        const normalized = {
            social: Math.min((data.socialMentions / maxValues.socialMentions) * 100, 100),
            search: Math.min((data.searchTrends / maxValues.searchTrends) * 100, 100),
            community: Math.min((data.communityActivity / maxValues.communityActivity) * 100, 100)
        };

        const score =
            normalized.social * weights.socialMentions +
            normalized.search * weights.searchTrends +
            normalized.community * weights.communityActivity;

        return Math.round(score);
    }

    /**
     * Get 24h price change
     */
    async getPriceChange(policyId) {
        // TODO: Integrate Blockfrost or DEX API
        // For now, mock realistic data
        return {
            change24h: (Math.random() * 40 - 20).toFixed(2), // -20% to +20%
            volume24h: Math.floor(Math.random() * 1000000),
            currentPrice: (Math.random() * 10).toFixed(6)
        };
    }

    /**
     * Analyze hype-to-price ratio
     */
    analyzeRatio(hypeScore, priceChange) {
        const priceChangeAbs = Math.abs(parseFloat(priceChange));

        // Handle stagnant market
        if (priceChangeAbs < 0.5) {
            return {
                ratio: 'N/A',
                status: 'stagnant',
                risk: 'medium',
                message: '💤 Dead zone - no price movement',
                explanation: `Hype score of ${hypeScore} with minimal price action (${priceChangeAbs}%) suggests market disconnect. Either hype is fake or price discovery hasn't happened yet.`
            };
        }

        const ratio = hypeScore / priceChangeAbs;

        // Determine status based on ratio
        if (ratio > 10) {
            return {
                ratio: ratio.toFixed(2),
                status: 'overhyped',
                risk: 'high',
                message: '🤡 Clown energy detected - all talk, no action',
                explanation: `Ratio of ${ratio.toFixed(2)} means hype (${hypeScore}) is ${Math.floor(ratio)}x larger than price movement (${priceChangeAbs}%). Possible pump-and-dump or bot activity.`
            };
        } else if (ratio < 2) {
            return {
                ratio: ratio.toFixed(2),
                status: 'undervalued',
                risk: 'opportunity',
                message: '🐋 Whale might be lurking - silent accumulation',
                explanation: `Low ratio (${ratio.toFixed(2)}) with ${priceChangeAbs}% price change vs ${hypeScore} hype suggests smart money accumulating quietly. Early discovery phase.`
            };
        } else if (ratio >= 5 && ratio <= 10) {
            return {
                ratio: ratio.toFixed(2),
                status: 'cautious',
                risk: 'medium',
                message: '⚠️ Moderate hype - proceed with caution',
                explanation: `Ratio of ${ratio.toFixed(2)} indicates moderate hype-to-price imbalance. Market may be getting ahead of fundamentals.`
            };
        } else {
            return {
                ratio: ratio.toFixed(2),
                status: 'balanced',
                risk: 'low',
                message: '⚖️ Hype matches price action - healthy signal',
                explanation: `Balanced ratio (${ratio.toFixed(2)}) suggests organic growth. Hype and price are moving together naturally.`
            };
        }
    }

    /**
     * Cache management
     */
    getCachedRatio(policyId) {
        return cache.get(`hype_${policyId}`);
    }

    cacheRatio(policyId, data) {
        cache.set(`hype_${policyId}`, data);
    }

    /**
     * Save to database for historical tracking
     */
    saveToDatabase(data) {
        // We need to access the raw db object to run this INSERT.
        // Since db.js doesn't export the raw db, we might need to add a helper there or use a new connection.
        // For simplicity, I'll assume we can add a 'insertHypeMetric' function to db.js or just skip persistence if strictly not required by the prompt's core logic, 
        // but the prompt explicitly asked for it.
        // I will add `insertHypeMetric` to db.js in a subsequent step or modify this file to require sqlite3 directly if needed.
        // But better to keep DB logic in db.js.
        // For now, I will comment this out and add a TODO to update db.js.
        // Actually, I can just require sqlite3 here and do it, but that breaks the pattern.
        // I'll add `insertHypeMetric` to db.js.

        if (db.insertHypeMetric) {
            db.insertHypeMetric(data).catch(err => console.error('[HypeAnalyzer] DB Save Error:', err));
        } else {
            console.warn('[HypeAnalyzer] insertHypeMetric not available in db.js');
        }
    }
}

module.exports = new HypeAnalyzer();
