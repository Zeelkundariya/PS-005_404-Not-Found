module.exports.calculateClusterEfficiency = ({
  myOutput,
  targetOutput,
  clusterAvgEfficiency = 78 // Bhilwara Synthetic Textile Cluster Average
}) => {
  const myEfficiency = targetOutput > 0 ? (myOutput / targetOutput * 100) : 0;
  const percentile = (myEfficiency / clusterAvgEfficiency * 100).toFixed(1);

  const status = myEfficiency >= clusterAvgEfficiency
    ? "🏆 Leading Bhilwara Cluster"
    : "📉 Below District Average - Optimization Required";

  return {
    myEfficiency: `${myEfficiency.toFixed(1)}%`,
    clusterAvg: `${clusterAvgEfficiency}%`,
    clusterPercentile: `${percentile}%`,
    status,
    recommendation: myEfficiency < clusterAvgEfficiency
      ? "Focus on Loom Optimization to reach Cluster Standards."
      : "Maintain current efficiency to remain a Cluster Leader."
  };
};