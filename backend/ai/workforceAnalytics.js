module.exports.calculateWorkforceAnalytics = ({
  outputProduced,
  assignedTarget,
  totalWorkers,
  absentWorkers,
  overtimeHours,
  overtimeOutput
}) => {

  const efficiency =
    assignedTarget === 0
      ? 0
      : Math.round((outputProduced / assignedTarget) * 100);

  const absenteeismImpact =
    totalWorkers === 0
      ? 0
      : Math.round((absentWorkers / totalWorkers) * 100);

  const overtimeProductivity =
    overtimeHours === 0
      ? 0
      : Math.round(overtimeOutput / overtimeHours);

  return {
    workerEfficiency: efficiency,
    absenteeismImpact,
    overtimeProductivity
  };
};