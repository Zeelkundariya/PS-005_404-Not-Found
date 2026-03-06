module.exports.checkEligibility = ({
  msmeRegistered,
  annualTurnover,
  energyConsumption
}) => {

  const schemes = [];

  if (msmeRegistered)
    schemes.push("✔ Rajasthan Textile Subsidy Scheme");

  if (energyConsumption > 100000)
    schemes.push("✔ MSME Energy Rebate");

  if (annualTurnover < 5)
    schemes.push("✔ Small Enterprise Growth Support");

  return { eligibleSchemes: schemes };
};