module.exports.getRecommendations = ({
  healthScore,
  inventoryLow,
  delayRisk
}) => {
  const actions = [];

  if (healthScore < 60)
    actions.push("Schedule maintenance within 2 days");

  if (inventoryLow)
    actions.push("Reorder raw material immediately");

  if (delayRisk.includes("High"))
    actions.push("Add one extra shift to avoid delay");

  return actions;
};