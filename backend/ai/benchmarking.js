module.exports.getBenchmarkComparison = ({
  yourPEI,
  clusterAverage
}) => {

  const status =
    yourPEI > clusterAverage
      ? "🟢 Above Industry Average"
      : "🟡 Below Industry Average";

  return {
    yourPEI,
    clusterAverage,
    status
  };
};