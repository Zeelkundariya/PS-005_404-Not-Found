module.exports.projectProfitMargin = ({
  revenue,
  cost,
  yarnIncreasePercent
}) => {

  const margin =
    ((revenue - cost) / revenue * 100).toFixed(1);

  const projectedMargin =
    (margin - yarnIncreasePercent).toFixed(1);

  return {
    currentMargin: margin,
    projectedMargin
  };
};