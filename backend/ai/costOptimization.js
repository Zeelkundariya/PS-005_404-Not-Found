module.exports.calculateCostOptimization = ({
  totalCost,
  totalUnitsProduced,
  downtimeHours,
  lossPerHour,
  wastageKg,
  costPerKg
}) => {

  const costPerUnit =
    totalUnitsProduced === 0
      ? 0
      : (totalCost / totalUnitsProduced).toFixed(2);

  const downtimeLoss = downtimeHours * lossPerHour;

  const wastageCost = wastageKg * costPerKg;

  return {
    costPerUnit,
    downtimeLoss,
    wastageCost,
    breakdown: [
      { name: 'Labor', target: totalCost * 0.25, actual: totalCost * 0.2 },
      { name: 'Material', target: totalCost * 1.1, actual: totalCost },
      { name: 'Energy', target: totalCost * 0.15, actual: totalCost * 0.1 },
    ]
  };
};