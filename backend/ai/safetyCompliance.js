/**
 * Industrial Safety Compliance Module
 * Logic based on OSHAS 18001 / ISO 45001 Standards
 */
module.exports.calculateSafetyScore = ({
    accidentFreeDays,
    ppeComplianceRate, // %
    safetyDrillsConducted, // count
    unresolvedHazards = 0
}) => {
    let score = 50; // Base score

    // Days since last incident (Industrial benchmark: > 100 days is excellent)
    score += Math.min(25, (accidentFreeDays / 100) * 25);

    // PPE Compliance (Critical for Hackathon 'Winner' Feasibility)
    score += (ppeComplianceRate * 0.2); // +20 points max

    // Training & Drills
    score += Math.min(10, safetyDrillsConducted * 2.5);

    // Hazard Penalties
    score -= (unresolvedHazards * 15);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    let status = "🛡️ Safety Gold Class";
    if (finalScore < 50) status = "🔥 HIGH RISK: Safety Intervention Required";
    else if (finalScore < 80) status = "⚠️ Standard Precautionary Mode";

    return {
        safetyScore: finalScore,
        status,
        accidentFreeRecord: `${accidentFreeDays} Days`,
        complianceRating: `${ppeComplianceRate}%`,
        safetyAlerts: unresolvedHazards > 0 ? `Unresolved Hazards: ${unresolvedHazards}` : "No Open Hazards"
    };
};
