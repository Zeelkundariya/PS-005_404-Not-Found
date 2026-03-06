module.exports.calculateWasteMetrics = ({
  totalWasteKg,
  reusableWasteKg,
  resalePricePerKg
}) => {

  const reusePercent =
    totalWasteKg === 0
      ? 0
      : Math.round((reusableWasteKg / totalWasteKg) * 100);

  const resaleValue = reusableWasteKg * resalePricePerKg;

  return {
    reusePercent,
    resaleValue
  };
};