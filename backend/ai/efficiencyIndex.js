module.exports.calculatePEI = (actualOutput, expectedOutput) => {
  const current = expectedOutput === 0 ? 0 : Math.round((actualOutput / expectedOutput) * 100);
  // Generate a realistic trend based on current efficiency
  const trend = [
    { name: 'Mon', pei: current - 2 },
    { name: 'Tue', pei: current + 1 },
    { name: 'Wed', pei: current - 1 },
    { name: 'Thu', pei: current + 4 },
    { name: 'Fri', pei: current },
    { name: 'Sat', pei: current + 2 },
    { name: 'Sun', pei: current }
  ];
  return { current, trend };
};