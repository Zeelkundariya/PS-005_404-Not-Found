module.exports.calculatePowerAnalytics = ({
  powerUsedKwh,
  costPerKwh,
  fabricProduced,
  solarContributionKwh = 0
}) => {
  const gridPowerUsed = Math.max(0, powerUsedKwh - solarContributionKwh);
  const totalEnergyCost = gridPowerUsed * costPerKwh;
  const solarPercentage = powerUsedKwh > 0 ? (solarContributionKwh / powerUsedKwh * 100).toFixed(1) : 0;

  const costPerMeter = fabricProduced === 0 ? 0 : (totalEnergyCost / fabricProduced).toFixed(2);

  const solarBenefit = (solarContributionKwh * costPerKwh).toFixed(2);

  const alert = solarPercentage < 20
    ? "⚠️ Low Solar Utilization - Increase Daytime Load to Optimize OPEX"
    : "🟢 High Solar Efficiency - Maximizing Renewable ROI";

  return {
    totalEnergyCost,
    costPerMeter,
    solarContribution: `${solarPercentage}%`,
    solarSavings: `₹${solarBenefit}`,
    energyAlert: alert,
    optimizationTip: "Shift heavy batch production to 11 AM - 3 PM to maximize Solar Harvesting."
  };
};