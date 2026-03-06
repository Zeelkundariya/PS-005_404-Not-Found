module.exports.findDelayRootCause = (avgOutput, uptime, inventoryLow) => {
  let causes = [];

  if (avgOutput < 80) causes.push("Low production output");
  if (uptime < 70) causes.push("Machine downtime");
  if (inventoryLow) causes.push("Raw material shortage");

  return causes.length ? causes : ["No major risk factors detected"];
};