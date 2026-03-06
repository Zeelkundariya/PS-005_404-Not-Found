module.exports.calculateWaterMetrics = ({
  waterUsedLiters,
  costPerLiter,
  fabricProduced,
  recycledWaterLiters = 0
}) => {
  const freshWaterUsed = Math.max(0, waterUsedLiters - recycledWaterLiters);
  const totalWaterCost = freshWaterUsed * costPerLiter;
  const recyclingRate = waterUsedLiters > 0 ? (recycledWaterLiters / waterUsedLiters * 100).toFixed(1) : 0;

  const waterPerMeter = fabricProduced === 0 ? 0 : (freshWaterUsed / fabricProduced).toFixed(2);

  // ZLD Score: Focus on recycling rate (90%+ is ideal for ZLD houses)
  const zldScore = Math.min(100, Math.round(recyclingRate * 1.1));

  const alert = recyclingRate < 80
    ? "⚠️ Low Recycling Rate - Risk of ZLD Non-Compliance"
    : "🟢 Professional ZLD Standards Maintained";

  return {
    totalWaterCost,
    waterPerMeter,
    recyclingRate: `${recyclingRate}%`,
    zldScore,
    alert,
    trend: [
      { name: 'Shift A', used: freshWaterUsed * 0.3, recycled: recycledWaterLiters * 0.3 },
      { name: 'Shift B', used: freshWaterUsed * 0.4, recycled: recycledWaterLiters * 0.4 },
      { name: 'Shift C', used: freshWaterUsed * 0.3, recycled: recycledWaterLiters * 0.3 }
    ]
  };
};