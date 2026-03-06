module.exports.generateRiskLevel = (value, thresholdLow, thresholdHigh) => {
  if (value >= thresholdHigh) return "🔴 Critical";
  if (value >= thresholdLow) return "🟡 Moderate";
  return "🟢 Safe";
};