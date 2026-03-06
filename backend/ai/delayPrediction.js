module.exports.predictDelay = (avgOutput, daysLeft, requiredQty) => {
  if (avgOutput * daysLeft < requiredQty) {
    return "⚠️ High Risk of Delay";
  }
  return "✅ On-Time Delivery Expected";
};