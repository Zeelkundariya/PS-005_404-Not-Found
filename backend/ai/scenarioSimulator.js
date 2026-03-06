module.exports.simulateScenario = (outputPerShift, shifts, deadlineDays) => {
  const projectedOutput = outputPerShift * shifts * deadlineDays;
  const target = 500;
  const diff = projectedOutput - target;

  if (diff >= 0) {
    return `✅ Projection: ${projectedOutput} units. Ahead of target by ${diff} units. Delivery confirmed.`;
  } else {
    return `⚠️ Alert: Projected ${projectedOutput} units vs ${target} target. Shortfall of ${Math.abs(diff)} units detected.`;
  }
};