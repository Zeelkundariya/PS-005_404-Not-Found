module.exports.predictMaintenance = ({
  uptimeHours,
  breakdownsCount,
  vibrationLevel = 45, // Default normal vibration in Hz/mm
  avgTemp = 32 // Default normal temp in Celsius
}) => {
  // Probability-based wear logic
  // Normal vibration: 30-50, Danger: > 80
  // Normal Temp: 30-45C, Danger: > 65C

  let probability = 0;

  // Uptime impact (Logarithmic wear)
  probability += (Math.log10(uptimeHours + 1) * 15);

  // Vibration impact
  if (vibrationLevel > 50) probability += (vibrationLevel - 50) * 1.5;

  // Temperature impact
  if (avgTemp > 45) probability += (avgTemp - 45) * 2;

  // Breakdown history multiplier
  const breakdownFactor = 1 + (breakdownsCount * 0.2);
  probability *= breakdownFactor;

  const finalProb = Math.min(100, Math.round(probability));

  let status = "✅ Optimal Operation";
  if (finalProb > 70) status = "🔴 CRITICAL: Immediate Service Required";
  else if (finalProb > 40) status = "⚠️ Warning: Scheduled Maintenance Recommended";

  return {
    maintenanceProbability: `${finalProb}%`,
    status,
    vibrationAnalysis: vibrationLevel > 70 ? "High Axis Deviation Detected" : "Stable",
    thermalStatus: avgTemp > 60 ? "Overheating Risk" : "Normal"
  };
};