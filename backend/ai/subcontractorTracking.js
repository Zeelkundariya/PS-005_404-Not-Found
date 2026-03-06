module.exports.trackSubcontractor = ({
  jobsAssigned,
  jobsDelayed
}) => {

  const performance =
    jobsAssigned === 0
      ? 0
      : Math.round(((jobsAssigned - jobsDelayed) / jobsAssigned) * 100);

  return {
    performanceScore: performance,
    delayImpact: jobsDelayed
  };
};