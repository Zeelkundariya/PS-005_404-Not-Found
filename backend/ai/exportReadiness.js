module.exports.calculateExportScore = ({
  qualityScore,
  deliveryScore,
  complianceScore,
  sustainabilityScore
}) => {

  const score =
    (qualityScore +
      deliveryScore +
      complianceScore +
      sustainabilityScore) / 4;

  return {
    exportReadinessScore: Math.round(score)
  };
};