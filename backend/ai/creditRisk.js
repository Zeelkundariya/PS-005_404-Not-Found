module.exports.analyzeCreditRisk = ({ totalInvoices, totalDelayDays, score = 80 }) => {
  const avgDelay = totalInvoices === 0 ? 28 : (totalDelayDays / totalInvoices).toFixed(1);
  return {
    avgCollectionDays: avgDelay,
    riskScore: score > 70 ? "Low" : "High",
    status: score > 70 ? "Excellent" : "Review Required"
  };
};