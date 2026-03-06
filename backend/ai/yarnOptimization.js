module.exports.optimizeYarnMix = ({
  currentCost,
  alternativeCost
}) => {

  const savingPercent =
    ((currentCost - alternativeCost) / currentCost * 100).toFixed(1);

  return {
    suggestion: `Use alternative blend to reduce cost by ${savingPercent}%`
  };
};