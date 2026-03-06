module.exports.detectAnomaly = (last7Days, todayValue) => {

  const avg =
    last7Days.reduce((a, b) => a + b, 0) / last7Days.length;

  if (todayValue < avg * 0.7)
    return "⚠️ Unusual production drop detected";

  return "🟢 Production Normal";
};