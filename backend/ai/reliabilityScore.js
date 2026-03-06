module.exports.calculateReliability = ({
  onTimeOrders,
  totalOrders,
  totalDelayDays
}) => {

  const reliability =
    totalOrders === 0
      ? 0
      : Math.round((onTimeOrders / totalOrders) * 100);

  const avgDelay =
    totalOrders === 0
      ? 0
      : (totalDelayDays / totalOrders).toFixed(1);

  return {
    availability: reliability,
    averageDelayDays: avgDelay
  };
};