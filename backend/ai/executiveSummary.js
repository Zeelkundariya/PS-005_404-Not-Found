module.exports.getExecutiveSummary = ({
  pei,
  avgHealth,
  delayRisk,
  inventoryAlerts
}) => {
  return {
    productionEfficiency: `${pei}%`,
    machineHealth: `${avgHealth}/100`,
    delayStatus: delayRisk,
    inventoryRisk: inventoryAlerts > 0 ? "⚠️ High" : "🟢 Low",
    recommendation: pei < 80 ? "Optimize shift distribution to boost efficiency." : "All systems performing at peak levels."
  };
};