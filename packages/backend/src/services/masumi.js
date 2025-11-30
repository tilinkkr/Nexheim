function explainRisk(token) {
    let lines = [];
    if (token.trust_score < 40) {
        lines.push("High risk: Check owner concentration and liquidity lock status.");
        lines.push("Warning: Trust score is significantly low.");
    } else if (token.trust_score < 70) {
        lines.push("Moderate risk: Some indicators are neutral, review contract details.");
        lines.push("Notice: Consider verifying developer activity.");
    } else {
        lines.push("Low risk: No red flags detected, but always verify before trading.");
        lines.push("Info: Strong trust indicators observed.");
    }

    return lines;
}

module.exports = { explainRisk };
