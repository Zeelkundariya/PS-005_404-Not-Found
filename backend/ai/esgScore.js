module.exports.calculateESG = (downtimeHours, wasteKg) => {
  let score = 100;
  score -= downtimeHours * 5;
  score -= wasteKg * 2;
  return score < 0 ? 0 : score;
};