module.exports.evaluateBuyerRisk = ({
  buyerDelayDays
}) => {

  let risk = "🟢 Low";

  if (buyerDelayDays > 45)
    risk = "🔴 High Risk Buyer";
  else if (buyerDelayDays > 30)
    risk = "🟡 Moderate Risk";

  return {
    buyerRisk: risk
  };
};