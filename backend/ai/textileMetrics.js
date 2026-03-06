module.exports.calculateTextileMetrics = ({
  loomRunningHours,
  totalAvailableHours,
  fabricMetersProduced,
  yarnUsedKg,
  dyeingBatchesCompleted,
  totalBatches
}) => {

  const loomUtilization =
    totalAvailableHours === 0
      ? 0
      : Math.min(98, Math.round((loomRunningHours / totalAvailableHours) * 100));

  const yarnConsumptionRate =
    fabricMetersProduced === 0
      ? 0
      : (yarnUsedKg / fabricMetersProduced).toFixed(2);

  const dyeingEfficiency =
    totalBatches === 0
      ? 0
      : Math.round((dyeingBatchesCompleted / totalBatches) * 100);

  return {
    loomUtilization,
    fabricOutput: fabricMetersProduced,
    yarnConsumptionRate,
    dyeingEfficiency,
    trend: [
      { hour: '00:00', output: Math.round(fabricMetersProduced * 0.1) },
      { hour: '04:00', output: Math.round(fabricMetersProduced * 0.15) },
      { hour: '08:00', output: Math.round(fabricMetersProduced * 0.2) },
      { hour: '12:00', output: Math.round(fabricMetersProduced * 0.22) },
      { hour: '16:00', output: Math.round(fabricMetersProduced * 0.18) },
      { hour: '20:00', output: Math.round(fabricMetersProduced * 0.15) },
    ]
  };
};