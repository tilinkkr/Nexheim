/**
 * Rug Probability Label Generator
 * Converts trust score to rug probability with visual indicators
 */

/**
 * Get rug probability label and emoji based on percentage
 * @param {number} rugProbability - 0 to 100
 * @returns {{ label: string, emoji: string, color: string, severity: string }}
 */
function getRugLabel(rugProbability) {
    if (rugProbability <= 20) {
        return {
            label: "Looks Legit",
            emoji: "🟢",
            color: "#22c55e", // green-500
            severity: "low"
        };
    } else if (rugProbability <= 40) {
        return {
            label: "Slightly Sketchy but Fun",
            emoji: "🟡",
            color: "#eab308", // yellow-500
            severity: "moderate"
        };
    } else if (rugProbability <= 60) {
        return {
            label: "Proceed with Caution",
            emoji: "🟠",
            color: "#f97316", // orange-500
            severity: "elevated"
        };
    } else if (rugProbability <= 80) {
        return {
            label: "High Risk – DYOR",
            emoji: "🔴",
            color: "#ef4444", // red-500
            severity: "high"
        };
    } else {
        return {
            label: "Almost Certainly a Rug",
            emoji: "💀",
            color: "#7f1d1d", // red-900
            severity: "critical"
        };
    }
}

/**
 * Calculate rug probability from trust score
 * @param {number} trustScore - 0 to 100
 * @returns {{ percentage: number, label: string, emoji: string, color: string, severity: string }}
 */
function calculateRugProbability(trustScore) {
    const rugProbability = Math.max(0, Math.min(100, 100 - trustScore));
    const label = getRugLabel(rugProbability);

    return {
        percentage: rugProbability,
        ...label
    };
}

/**
 * Add rug probability to token object
 * @param {Object} token - Token object with trustScore
 * @returns {Object} Token with rugProbability added
 */
function enrichWithRugProbability(token) {
    const trustScore = token.trustScore || token.trust_score || 50;
    const rugProbability = calculateRugProbability(trustScore);

    return {
        ...token,
        rugProbability
    };
}

module.exports = {
    getRugLabel,
    calculateRugProbability,
    enrichWithRugProbability
};
