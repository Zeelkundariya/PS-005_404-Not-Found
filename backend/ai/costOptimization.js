module.exports.calculateCostOptimization = ({ totalCost, totalUnitsProduced }) => {
  const costPerUnit = totalUnitsProduced === 0 ? 0 : (totalCost / totalUnitsProduced).toFixed(2);
  return {
    costPerUnit,
    breakdown: [
      { name: 'Labor', target: totalCost * 0.25, actual: totalCost * 0.2 },
      { name: 'Material', target: totalCost * 1.1, actual: totalCost },
      { name: 'Energy', target: totalCost * 0.15, actual: totalCost * 0.1 },
    ],
    totalSavings: (totalCost * 0.08).toFixed(1) // 8% AI optimization potential
  };
};