module.exports.checkQualityCompliance = ({
  gsmDeviation,
  colorVariance,
  shrinkagePercent,
  totalUnitsTested,
  defectsCount,
  certificationLevel = 'Basic' // Basic, ISO-9001, Oeko-Tex-100
}) => {
  // AQL 2.5 Standard (Acceptable Quality Level)
  // For textile exporting, 2.5 is the industry benchmark for major defects
  const aqlThreshold = Math.max(1, Math.round(totalUnitsTested * 0.025));
  const isAQLCompliant = defectsCount <= aqlThreshold;

  // Technical Specs compliance
  const isSpecCompliant = gsmDeviation <= 3 && colorVariance <= 2 && shrinkagePercent <= 1.5;

  let complianceScore = 100;
  if (!isAQLCompliant) complianceScore -= 40;
  if (!isSpecCompliant) complianceScore -= 30;
  if (certificationLevel === 'Basic') complianceScore -= 10;

  let status = "🏆 Global Export Ready (Oeko-Tex)";
  if (complianceScore < 60) status = "🔴 REJECTED: Mandatory Re-processing";
  else if (complianceScore < 85) status = "⚠️ Domestic Grade Only (Quality Warning)";

  return {
    complianceScore,
    statusLabel: status,
    aqlStatus: isAQLCompliant ? "AQL 2.5 Pass" : "AQL 2.5 Fail",
    defectsAllowed: aqlThreshold,
    specAudit: isSpecCompliant ? "All Specs Met" : "Dimension/Color Variance Detected",
    safetyCert: certificationLevel !== 'Basic' ? `Verified ${certificationLevel}` : "No Export Certification"
  };
};