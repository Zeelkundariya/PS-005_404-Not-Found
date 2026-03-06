module.exports.calculateMaintenanceScore = (uptime, breakdowns, daysSinceMaintenance) => {
  let score = 100;

  // Use a normalized wear factor: max 40 points off for uptime (relative to a 500h cycle)
  const uptimeFactor = Math.min(40, (uptime / 500) * 40);
  score -= uptimeFactor;

  score -= Math.min(40, breakdowns * 8);      // Max 40 points off for breakdowns
  score -= Math.min(20, daysSinceMaintenance * 0.2); // Max 20 points off for age

  return Math.max(0, Math.round(score));
};