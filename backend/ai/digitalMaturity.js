module.exports.calculateDigitalMaturity = ({
  hasIoT,
  hasInventorySystem,
  hasOrderTracking
}) => {
  let score = 20; // Base score for starting digital journey
  if (hasIoT) score += 30;
  if (hasInventorySystem) score += 25;
  if (hasOrderTracking) score += 25;

  return Math.min(100, score);
};