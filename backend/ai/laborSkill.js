module.exports.calculateSkillIndex = ({
  skilledWorkers,
  totalWorkers
}) => {

  const skillScore =
    totalWorkers === 0
      ? 0
      : Math.round((skilledWorkers / totalWorkers) * 100);

  return { skillScore };
};