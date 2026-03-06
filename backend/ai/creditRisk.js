module.exports.analyzeCreditRisk = ({
  totalInvoices,
  totalDelayDays
}) => {

  const avgDelay =
    totalInvoices === 0
      ? 0
      : (totalDelayDays / totalInvoices).toFixed(1);

  let risk = "🟢 Low";

  if (avgDelay > 45) risk = "🔴 High";
  else if (avgDelay > 30) risk = "🟡 Moderate";

  return {
    averagePaymentCycle: avgDelay,
    risk
  };
};