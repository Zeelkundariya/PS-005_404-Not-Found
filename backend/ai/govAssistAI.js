const governmentSchemes = require("./governmentSchemes");

/**
 * GovAssist AI Logic
 * Provides intelligence for government interactions
 */

// 1. Compliance Risk AI
module.exports.getComplianceStatus = (factoryData, iotData) => {
  const risks = [];
  let riskScore = 0;

  // Pollution / Environmental Compliance
  const waterUsage = iotData.sustainability.waterUsage;
  if (waterUsage > 2500) {
    risks.push({ category: "Environmental", issue: "High Water Consumption (Exceeds Cluster Norms)", risk: "High", action: "Review ZLD (Zero Liquid Discharge) recycling rates." });
    riskScore += 40;
  } else if (waterUsage > 2000) {
    risks.push({ category: "Environmental", issue: "Moderate Water Usage", risk: "Medium", action: "Optimize dyeing jet cycles." });
    riskScore += 20;
  }

  // Labor Compliance
  const workers = iotData.kpis.activeWorkers;
  const overtimeHours = Math.random() * 5; // Simplified simulation
  if (overtimeHours > 3) {
    risks.push({ category: "Labor", issue: "Excessive Overtime Detected", risk: "Medium", action: "Validate shift logs against labor department regulations." });
    riskScore += 25;
  }

  // Fire Safety Compliance
  const temp = iotData.gauges.avgTemp;
  if (temp > 80) {
    risks.push({ category: "Fire Safety", issue: "High Ambient Temperature in Production Floor", risk: "High", action: "Verify ventilation and firefighting equipment readiness." });
    riskScore += 30;
  }

  // Energy Compliance
  const solarPercent = iotData.gauges.solarPercent;
  if (solarPercent < 20) {
    risks.push({ category: "Energy", issue: "Low Renewable Energy Contribution", risk: "Notice", action: "Increase solar usage to meet Rajasthan Green Energy state targets." });
    riskScore += 10;
  }

  const normalizedScore = Math.max(0, 100 - riskScore);

  return {
    complianceScore: normalizedScore,
    risks: risks.length > 0 ? risks : [{ category: "General", issue: "No major issues detected", risk: "Low", action: "Maintain current reporting standards." }],
    lastAuditDate: new Date().toLocaleDateString(),
    status: normalizedScore > 80 ? "Good" : normalizedScore > 60 ? "Warning" : "Critical"
  };
};

// 2. Government Scheme Eligibility AI
module.exports.getSchemeEligibility = (factoryData) => {
  const baseEligibility = governmentSchemes.checkEligibility({
    msmeRegistered: true, // Assuming true for now
    turnoverCr: factoryData.turnoverCr || 50,
    investmentCr: factoryData.investmentCr || 10
  });

  const schemes = [
    {
      name: "RIPS-2024",
      fullName: "Rajasthan Investment Promotion Scheme",
      benefit: "₹1.2 Cr Capital Subsidy",
      eligibility: 92,
      status: "Eligible",
      color: "#10b981",
      category: "Investment",
      features: ["7-year interest subvention", "Electricity duty exemption", "Land tax rebate"]
    },
    {
      name: "AMTUFS",
      fullName: "Amended Technology Upgradation Fund",
      benefit: "15% Machinery Subsidy",
      eligibility: 85,
      status: "In Progress",
      color: "#3b82f6",
      category: "Machinery",
      features: ["Support for Air Jet Looms", "Textile cluster focus", "Online tracking"]
    },
    {
      name: "Solar Rebate",
      fullName: "Renewable Energy Support (Rajasthan)",
      benefit: "₹85k Monthly Savings",
      eligibility: 78,
      status: "Approved",
      color: "#fbbf24",
      category: "Energy",
      features: ["Net metering support", "Capital subsidy for panels", "Carbon credit linked"]
    },
    {
      name: "ZED Certification",
      fullName: "Zero Defect Zero Effect Support",
      benefit: "₹5 Lakh Grant",
      eligibility: 70,
      status: "Not Applied",
      color: "#f59e0b",
      category: "Quality",
      features: ["Certification fee reimbursement", "Efficiency audit support", "Market linkage"]
    }
  ];

  return {
    schemes: schemes.filter(s => baseEligibility.eligibleSchemes.some(es => es.includes(s.name))),
    summary: baseEligibility
  };
};

// 3. Inspection Readiness AI
module.exports.getInspectionReadiness = (iotData) => {
  // Use various metrics to simulate inspection readiness
  const maintenance = iotData.kpis.maintenanceScore;
  const safety = iotData.safety.safetyScore;
  const ppe = iotData.safety.ppeCompliance;
  const airQuality = iotData.sustainability.airQuality;

  const readinessScore = Math.round((maintenance * 0.3) + (safety * 0.3) + (ppe * 0.2) + ((150 - airQuality) / 1.5 * 0.2));

  const issues = [];
  if (maintenance < 85) issues.push("Preventative maintenance logs incomplete for Looms 1-4.");
  if (ppe < 95) issues.push("Worker PPE compliance below mandatory safety threshold (95%).");
  if (airQuality > 80) issues.push("Particulate matter levels in spinning area exceed PCB limits.");

  return {
    readinessScore: readinessScore,
    status: readinessScore > 85 ? "Inspection Ready" : readinessScore > 70 ? "Minor Deficiencies" : "Not Ready",
    issuesDetected: issues.length > 0 ? issues : ["All systems within compliance limits."],
    nextInspectionWindow: "April 2026",
    probabilityOfPass: Math.min(99, readinessScore + 5)
  };
};

// 4. AI Auto Report Generator
module.exports.generateReport = (type, iotData, factoryData) => {
  const timestamp = new Date().toISOString();
  
  const reportData = {
    reportId: `REP-${Math.floor(Math.random() * 90000) + 10000}`,
    timestamp: timestamp,
    factoryName: factoryData.name || "Bhilwara Smart Textiles",
    type: type,
  };

  switch (type) {
    case 'environmental':
      reportData.metrics = {
        waterUsage: iotData.sustainability.waterUsage,
        energySource: `${iotData.gauges.solarPercent}% Solar`,
        co2Saved: iotData.sustainability.co2Saved,
        wasteRecycled: "85%"
      };
      break;
    case 'labor':
      reportData.metrics = {
        totalWorkers: iotData.kpis.activeWorkers,
        accidentFreeDays: iotData.safety.accidentFreeDays,
        safetyCompliance: `${iotData.safety.safetyScore}%`,
        trainingHours: "128h (Month)"
      };
      break;
    case 'production':
      reportData.metrics = {
        totalOutput: iotData.kpis.outputToday,
        oeeScore: `${iotData.kpis.oeeScore}%`,
        defectRate: `${iotData.kpis.defectRate}%`,
        efficiency: `${iotData.kpis.pei}%`
      };
      break;
    default:
      reportData.metrics = {};
  }

  return reportData;
};
