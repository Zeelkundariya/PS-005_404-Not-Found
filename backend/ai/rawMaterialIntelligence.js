module.exports.analyzeYarnPrice = ({ currentPrice, lastWeekPrice }) => {

  const change = currentPrice - lastWeekPrice;
  const volatility = ((change / lastWeekPrice) * 100).toFixed(1);

  let alert = "🟢 Stable Price";

  if (Math.abs(volatility) > 8)
    alert = "⚠️ High price fluctuation detected";

  let suggestion =
    volatility > 5
      ? "Consider bulk buying before further increase"
      : "Monitor market before purchase";

  return {
    currentPrice,
    lastWeekPrice,
    volatility,
    alert,
    suggestion
  };
};