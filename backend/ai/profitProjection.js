module.exports.projectProfitMargin = ({ revenue, cost, actualOutputMeters = 5000 }) => {
  const profit = revenue - cost;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
  const costPerMeter = actualOutputMeters > 0 ? (cost / actualOutputMeters).toFixed(2) : 0;
  const monthlyProfit = (profit * 30 / 100).toFixed(2); // Simplified Crore conversion
  return {
    currentMargin: `${margin}%`,
    projectedMargin: `${(parseFloat(margin) + 1.5).toFixed(1)}%`,
    monthlyProfit: monthlyProfit,
    costPerMeter: `₹${costPerMeter}`
  };
};