module.exports.analyzeSeason = (month) => {

  const festiveMonths = [10, 11, 12];
  const weddingMonths = [1, 2, 3];

  if (festiveMonths.includes(month))
    return { demand: "🔴 High - Increase Production" };

  if (weddingMonths.includes(month))
    return { demand: "🟡 Moderate - Prepare Inventory" };

  return { demand: "🟢 Normal Demand" };
};