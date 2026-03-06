module.exports.trackTextileFlow = ({
  greyProduced,
  dyedCompleted,
  finishedCompleted
}) => {

  const rejection = greyProduced - dyedCompleted;
  const rejectionRate =
    greyProduced === 0
      ? 0
      : Math.round((rejection / greyProduced) * 100);

  let bottleneck = "🟢 No major bottleneck";

  if (rejectionRate > 8)
    bottleneck = "⚠️ High rejection at dyeing stage";

  return {
    greyProduced,
    dyedCompleted,
    finishedCompleted,
    rejection,
    rejectionRate,
    bottleneck
  };
};