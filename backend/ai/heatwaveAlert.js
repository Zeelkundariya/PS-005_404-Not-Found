module.exports.checkHeatwave = (temperature) => {

  if (temperature > 42)
    return {
      alert: "⚠️ Extreme Heat Alert - Productivity may drop 5-8%"
    };

  return { alert: "🟢 Temperature Normal" };
};