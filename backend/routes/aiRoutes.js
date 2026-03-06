const express = require("express");
const router = express.Router();

// Models
const Machine = require("../models/Machine");
const Inventory = require("../models/Inventory");
const ProductionLog = require("../models/ProductionLog");
const Order = require("../models/Order");
const Factory = require("../models/Factory");
const MarketData = require("../models/MarketData");

// AI Logic
const { predictDelay } = require("../ai/delayPrediction");
const { predictMaintenance } = require("../ai/maintenancePrediction");
const { calculateMaintenanceScore } = require("../ai/maintenanceScore");
const { findDelayRootCause } = require("../ai/delayRootCause");
const { calculatePEI } = require("../ai/efficiencyIndex");
const { calculateTextileMetrics } = require("../ai/textileMetrics");
const { calculateCostOptimization } = require("../ai/costOptimization");
const { calculateWorkforceAnalytics } = require("../ai/workforceAnalytics");
const { calculatePowerAnalytics } = require("../ai/powerAnalytics");
const { calculateReliability } = require("../ai/reliabilityScore");
const { generateRiskLevel } = require("../ai/riskHeatmap");
const { calculateDigitalMaturity } = require("../ai/digitalMaturity");
const { getBenchmarkComparison } = require("../ai/benchmarking");
const { detectAnomaly } = require("../ai/anomalyDetection");
const { analyzeYarnPrice } = require("../ai/rawMaterialIntelligence");
const { calculateWaterMetrics } = require("../ai/waterIntelligence");
const { analyzeCreditRisk } = require("../ai/creditRisk");
const { trackSubcontractor } = require("../ai/subcontractorTracking");
const { checkEligibility } = require("../ai/governmentSchemes");
const { getExecutiveSummary } = require("../ai/executiveSummary");
const { getRecommendations } = require("../ai/recommendations");
const { simulateScenario } = require("../ai/scenarioSimulator");
const { calculateESG } = require("../ai/esgScore");
const { analyzeSeason } = require("../ai/seasonalDemand");
const { calculateSkillIndex } = require("../ai/laborSkill");
const { checkHeatwave } = require("../ai/heatwaveAlert");
const { trackTextileFlow } = require("../ai/textileFlow");
const { checkQualityCompliance } = require("../ai/qualityCompliance");
const { optimizeYarnMix } = require("../ai/yarnOptimization");
const { calculateWasteMetrics } = require("../ai/wasteRecycling");
const { calculateExportScore } = require("../ai/exportReadiness");
const { calculateClusterEfficiency } = require("../ai/clusterIntelligence");
const { projectProfitMargin } = require("../ai/profitProjection");
const { evaluateBuyerRisk } = require("../ai/creditInsurance");
const { calculateSafetyScore } = require("../ai/safetyCompliance");










router.post("/delay", async (req, res) => {
  try {
    const { avgOutput: bodyOutput, daysLeft: bodyDays, requiredQty: bodyQty } = req.body;

    // Fallback logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const dbAvgOutput = logs.length > 0 ? logs.reduce((acc, l) => acc + (l.output || 0), 0) / logs.length : 80;

    const order = await Order.findOne({ status: "In Progress" }).sort({ deadline: 1 });
    const dbDaysLeft = order ? Math.max(1, Math.ceil((new Date(order.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : 5;
    const dbRequiredQty = order ? order.quantity : 500;

    const result = predictDelay(
      bodyOutput || dbAvgOutput,
      bodyDays || dbDaysLeft,
      bodyQty || dbRequiredQty
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/maintenance", async (req, res) => {
  try {
    const { uptimeHours, vibration, temp, breakdowns } = req.body;
    
    const machines = await Machine.find();
    const dbUptime = machines.reduce((acc, m) => acc + (m.uptimeHours || 0), 0);
    const dbBreakdowns = machines.reduce((acc, m) => acc + (m.breakdownCount || 0), 0);

    res.json(predictMaintenance({
      uptimeHours: uptimeHours !== undefined ? uptimeHours : dbUptime,
      breakdownsCount: breakdowns !== undefined ? breakdowns : dbBreakdowns,
      vibrationLevel: vibration,
      avgTemp: temp
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/maintenance-score", async (req, res) => {
  try {
    const { uptime: bodyUptime, breakdowns: bodyBreakdowns, daysSince: bodyDays } = req.body;

    const machines = await Machine.find();
    const dbUptime = machines.reduce((acc, m) => acc + m.uptimeHours, 0);
    const dbBreakdowns = machines.reduce((acc, m) => acc + m.breakdownCount, 0);

    const score = calculateMaintenanceScore(
      bodyUptime !== undefined ? bodyUptime : dbUptime,
      bodyBreakdowns !== undefined ? bodyBreakdowns : dbBreakdowns,
      bodyDays || 15
    );
    res.json({ score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delay-root-cause", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });

    const avgOutput = logs.reduce((acc, l) => acc + l.output, 0) / (logs.length || 1);
    const uptime = machines.reduce((acc, m) => acc + m.uptimeHours, 0) / machines.length;
    const inventoryLow = inventory.some(i => i.quantity < i.minThreshold);

    const causes = findDelayRootCause(avgOutput, uptime, inventoryLow);
    res.json({ causes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/efficiency", async (req, res) => {
  try {
    const { actualOutput: bodyActual, expectedOutput: bodyExpected } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const dbActualOutput = logs.reduce((acc, l) => acc + l.output, 0);
    const factory = await Factory.findOne() || { targetOutput: 5000 };
    const dbExpectedOutput = factory.targetOutput;

    const actual = bodyActual !== undefined ? bodyActual : dbActualOutput;
    const expected = bodyExpected !== undefined ? bodyExpected : dbExpectedOutput;

    // Trend logic (simplified for manual entry)
    const result = calculatePEI(actual, expected);
    res.json({ current: result.current, trend: result.trend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/executive-summary", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });

    const factory = await Factory.findOne() || { targetOutput: 5000 };
    const actualOutput = logs.reduce((acc, l) => acc + (l.output || 0), 0);
    const targetOutput = factory.targetOutput || 5000;
    const pei = Math.round((actualOutput / targetOutput) * 100) || 0;

    const avgHealth = machines.length > 0
      ? Math.round(machines.reduce((acc, m) => acc + (100 - (m.breakdownCount || 0) * 5), 0) / machines.length)
      : 0;
    const alertCount = inventory.filter(i => (i.quantity || 0) < (i.minThreshold || 0)).length;

    const summary = getExecutiveSummary({
      pei,
      avgHealth,
      delayRisk: pei < 70 ? "High" : "Low",
      inventoryAlerts: alertCount
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/recommendations", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const avgHealth = machines.length > 0
      ? Math.round(machines.reduce((acc, m) => acc + (100 - (m.breakdownCount || 0) * 5), 0) / machines.length)
      : 0;
    const inventoryLow = inventory.some(i => (i.quantity || 0) < (i.minThreshold || 0));

    const actions = getRecommendations({
      healthScore: avgHealth,
      inventoryLow,
      delayRisk: avgHealth < 70 ? "High" : "Low"
    });
    res.json({ actions: actions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/simulate", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const avgOutput = logs.length > 0 ? logs.reduce((acc, l) => acc + (l.output || 0), 0) / logs.length : 150;

    const { outputPerShift, shifts, deadlineDays } = req.body;
    // Default to current stats if no overrides provided
    res.json({
      result: simulateScenario(outputPerShift || avgOutput, shifts || 3, deadlineDays || 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/esg", async (req, res) => {
  try {
    const { downtimeHours: bodyDowntime, wasteKg: bodyWaste } = req.body;

    const machines = await Machine.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const output = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const dbDowntime = machines.reduce((acc, m) => acc + ((m.breakdownCount || 0) * 2), 0);
    const dbWasteKg = Math.round(output * 0.015);

    res.json({
      esgScore: calculateESG(
        bodyDowntime !== undefined ? bodyDowntime : dbDowntime,
        bodyWaste !== undefined ? bodyWaste : dbWasteKg
      )
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/textile-metrics", async (req, res) => {
  try {
    const { fabricProduced: bodyFabric, loomHours: bodyLoom, yarnUsed: bodyYarn } = req.body;

    const machines = await Machine.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });

    const dbFabric = logs.reduce((acc, l) => acc + l.output, 0);
    const dbLoomHours = machines
      .filter(m => m.name.includes("Loom"))
      .reduce((acc, m) => acc + (m.uptimeHours / 10), 0);

    const metrics = calculateTextileMetrics({
      loomRunningHours: bodyLoom !== undefined ? bodyLoom : Math.min(24, dbLoomHours / (machines.filter(m => m.name.includes("Loom")).length || 1)),
      totalAvailableHours: 24,
      fabricMetersProduced: bodyFabric !== undefined ? bodyFabric : dbFabric,
      yarnUsedKg: bodyYarn !== undefined ? bodyYarn : Math.round((bodyFabric || dbFabric) * 0.2)
    });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/cost-optimization", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const factory = await Factory.findOne() || { powerCostPerKwh: 8 };

    const downtimeHours = machines.reduce((acc, m) => acc + (m.breakdownCount * 2), 0);
    // Material cost based on inventory value (simulated price per material)
    const totalMaterialCost = inventory.reduce((acc, i) => acc + (i.quantity * (i.material.includes("Cotton") ? 200 : 150)), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const actualOutputToday = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const result = calculateCostOptimization({
      totalCost: totalMaterialCost + (actualOutputToday * factory.powerCostPerKwh),
      totalUnitsProduced: actualOutputToday || 1000,
      downtimeHours,
      lossPerHour: 1200, // Derived from avg production value
      wastageKg: Math.round(actualOutputToday * 0.02),
      costPerKg: 180
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/workforce", async (req, res) => {
  try {
    const { workers: bodyWorkers, actualOutput: bodyOutput } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const dbOutput = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const activeMachineIds = [...new Set(logs.map(l => l.machineId))];
    const dbWorkers = Math.max(10, activeMachineIds.length * 2);

    res.json(calculateWorkforceAnalytics({
      workers: bodyWorkers !== undefined ? bodyWorkers : dbWorkers,
      output: bodyOutput !== undefined ? bodyOutput : dbOutput
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/power", async (req, res) => {
  try {
    const { powerUsed: bodyPower, solarContribution: bodySolar } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const output = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const factory = await Factory.findOne() || { powerCostPerKwh: 8 };
    const dbPowerUsed = output * 0.5;

    res.json(calculatePowerAnalytics({
      powerUsedKwh: bodyPower !== undefined ? bodyPower : dbPowerUsed,
      solarContributionKwh: bodySolar !== undefined ? bodySolar : (dbPowerUsed * 0.15), // Default 15% solar
      costPerKwh: factory.powerCostPerKwh
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reliability", async (req, res) => {
  try {
    const machines = await Machine.find();
    const totalUptime = machines.reduce((acc, m) => acc + m.uptimeHours, 0);
    // Rough estimate of total time (uptime + theoretical downtime from breakdowns)
    const totalTime = totalUptime + (machines.reduce((acc, m) => acc + m.breakdownCount, 0) * 4);

    res.json(calculateReliability({ uptime: totalUptime, totalTime }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/risk", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const orders = await Order.find({ status: { $ne: "Completed" } });

    const avgHealth = machines.length > 0 ? (machines.reduce((acc, m) => acc + (100 - (m.breakdownCount || 0) * 5), 0) / machines.length) : 80;
    const lowStockItems = inventory.filter(i => (i.quantity || 0) < (i.minThreshold || 0)).length;
    const pendingOrders = orders.length;

    // Advanced Risk Factor: Health stress + Stock gaps + Order backlog
    const riskFactor = ((100 - avgHealth) + (lowStockItems * 15) + (pendingOrders * 5)) / 2.5;
    res.json({ risk: generateRiskLevel(riskFactor, 25, 75) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/digital-maturity", async (req, res) => {
  try {
    const machines = await Machine.find();
    const inventory = await Inventory.find();
    const orders = await Order.find();
    res.json({
      score: calculateDigitalMaturity({
        hasIoT: machines.length > 3, // Advanced if many machines connected
        hasInventorySystem: inventory.length > 5,
        hasOrderTracking: orders.length > 0
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/benchmark", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const actualOutput = logs.reduce((acc, l) => acc + (l.output || 0), 0);
    const factory = await Factory.findOne() || { targetOutput: 5000 };

    const myEfficiency = Math.round((actualOutput / (factory.targetOutput || 5000)) * 100);
    res.json(getBenchmarkComparison({ myEfficiency, industryAvg: 78 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/anomaly", async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const logs = await ProductionLog.find({ date: { $gte: weekAgo } });

    const dailyOutput = {};
    logs.forEach(l => {
      const d = l.date.toISOString().split('T')[0];
      dailyOutput[d] = (dailyOutput[d] || 0) + l.output;
    });

    const history = Object.values(dailyOutput);
    const todayValue = history.pop() || 0;

    res.json({
      result: detectAnomaly(history, todayValue)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/yarn-price", async (req, res) => {
  try {
    const { yarnPrice: bodyPrice } = req.body;

    const marketItems = await MarketData.find({ commodity: /Cotton/i });
    const dbPrice = marketItems.length > 0 ? marketItems[0].price : 185;
    const currentPrice = bodyPrice !== undefined ? bodyPrice : dbPrice;

    // Simulate a small trend based on current price
    const lastWeekPrice = currentPrice * 0.98;

    res.json(analyzeYarnPrice({
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      lastWeekPrice: parseFloat(lastWeekPrice.toFixed(2))
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/water", async (req, res) => {
  try {
    const { waterUsage: bodyWater, recycledWater: bodyRecycled } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const currentOutput = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const dbWaterUsed = currentOutput * 5;
    res.json(calculateWaterMetrics({
      waterUsedLiters: bodyWater !== undefined ? bodyWater : dbWaterUsed,
      recycledWaterLiters: bodyRecycled !== undefined ? bodyRecycled : (dbWaterUsed * 0.4), // Default 40% recycling
      costPerLiter: 0.05,
      fabricProduced: currentOutput
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/credit-risk", async (req, res) => {
  try {
    const orders = await Order.find();
    const completedCount = orders.filter(o => o.status === "Completed").length;
    const totalCount = orders.length || 1;

    // Algorithm: Fulfillment rate + Turnover factor
    const factory = await Factory.findOne() || { turnoverCr: 10 };
    const baseScore = 600 + (completedCount / totalCount * 200);
    const turnoverBonus = Math.min(100, factory.turnoverCr * 2);

    res.json(analyzeCreditRisk({ score: Math.round(baseScore + turnoverBonus) }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/subcontractor", async (req, res) => {
  try {
    const orders = await Order.find({ status: "In Progress" });
    const progress = orders.length > 0 ? 60 : 100; // Simulated progress for in-progress orders
    res.json(trackSubcontractor({ deadline: 10, progress }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/gov-schemes", async (req, res) => {
  try {
    const factory = await Factory.findOne() || { investmentCr: 10, turnoverCr: 50 };
    res.json(checkEligibility({ investment: factory.investmentCr, sector: "Textile", turnover: factory.turnoverCr }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/seasonal-demand", async (req, res) => {
  try {
    const month = new Date().getMonth() + 1; // Real current month
    const result = analyzeSeason(month);
    res.json({ ...result, currentMonth: new Date().toLocaleString('default', { month: 'long' }) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/labor-skill", async (req, res) => {
  try {
    const machines = await Machine.find();
    const avgHealth = machines.reduce((acc, m) => acc + (100 - m.breakdownCount * 5), 0) / (machines.length || 1);

    // Derived: better machine health implies better maintenance skills
    res.json(calculateSkillIndex({ trainingHours: Math.round(avgHealth / 2) }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/heatwave", async (req, res) => {
  try {
    // Rajasthan-Specific: Temperature from external sensor or default
    const temp = 42 + (Math.sin(Date.now() / 1000000) * 5);
    res.json(checkHeatwave(temp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/textile-flow", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });

    // Simulate flow analysis based on machine types active today
    const activeMachines = await Machine.find({ _id: { $in: logs.map(l => l.machineId) } });
    const stages = [...new Set(activeMachines.map(m => m.name.split('-')[0]))];

    res.json(trackTextileFlow({ stages: stages.length > 0 ? stages : ["Spinning", "Weaving"] }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/quality", async (req, res) => {
  try {
    const { 
      gsmDeviation, 
      colorVariance, 
      shrinkage, 
      totalUnits, 
      defects, 
      certification 
    } = req.body;

    const machines = await Machine.find();
    const avgHealth = machines.reduce((acc, m) => acc + (100 - (m.breakdownCount || 0) * 5), 0) / (machines.length || 1);

    const dbDefects = Math.max(0, Math.round((100 - avgHealth) / 10));
    const dbTotalUnits = 1000;

    res.json(checkQualityCompliance({
      gsmDeviation: gsmDeviation || 2,
      colorVariance: colorVariance || 1,
      shrinkagePercent: shrinkage || 1,
      totalUnitsTested: totalUnits || dbTotalUnits,
      defectsCount: defects !== undefined ? defects : dbDefects,
      certificationLevel: certification || 'Oeko-Tex-100'
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/yarn-optimize", async (req, res) => {
  try {
    const inventory = await Inventory.find({ material: /Cotton/i });
    const stock = inventory.length > 0 ? inventory[0].quantity : 0;

    res.json(optimizeYarnMix({ material: "Cotton", cost: stock > 500 ? 180 : 220 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/waste", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const output = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    // Algorithm: 2.2% waste for Cotton, 1.8% for Synthetic
    const inventory = await Inventory.find();
    const dominantMaterial = inventory.sort((a, b) => b.quantity - a.quantity)[0]?.material || "Cotton";
    const wasteFactor = dominantMaterial.includes("Cotton") ? 0.022 : 0.018;

    const totalWasteKg = Math.round(output * wasteFactor);
    res.json(calculateWasteMetrics({
      totalWasteKg,
      reusableWasteKg: Math.round(totalWasteKg * 0.45),
      resalePricePerKg: dominantMaterial.includes("Cotton") ? 18 : 12
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/export-score", async (req, res) => {
  try {
    const orders = await Order.find();
    const completedOnTime = orders.filter(o => o.status === "Completed").length;
    const score = 70 + (completedOnTime * 5);

    res.json(calculateExportScore({ complianceCheck: true, marketAccess: Math.min(100, score) }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/cluster", async (req, res) => {
  try {
    const { actualOutput: bodyOutput, targetOutput: bodyTarget } = req.body;

    const machines = await Machine.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const actualOutputToday = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const factory = await Factory.findOne() || { targetOutput: 5000 };

    res.json(calculateClusterEfficiency({
      myOutput: bodyOutput !== undefined ? bodyOutput : actualOutputToday,
      targetOutput: bodyTarget !== undefined ? bodyTarget : factory.targetOutput
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/profit", async (req, res) => {
  try {
    const { cost: bodyCost, price: bodyPrice } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ProductionLog.find({ date: { $gte: today } });
    const output = logs.reduce((acc, l) => acc + (l.output || 0), 0);

    const factory = await Factory.findOne() || { turnoverCr: 10 };
    const dbCost = output * 190;
    const dbPrice = output * 280;
    const projectionFactor = 1 + (factory.turnoverCr / 100);

    res.json(projectProfitMargin({
      cost: bodyCost !== undefined ? bodyCost : dbCost * projectionFactor,
      price: bodyPrice !== undefined ? bodyPrice : dbPrice * projectionFactor
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/buyer-risk", async (req, res) => {
  try {
    const orders = await Order.find();
    const delayedOrders = orders.filter(o => o.status !== "Completed" && o.deadline < new Date()).length;
    const score = 80 - (delayedOrders * 10);

    res.json(evaluateBuyerRisk({ score }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/safety", async (req, res) => {
  try {
    const { 
      accidentFreeDays, 
      ppeComplianceRate, 
      drills, 
      hazards 
    } = req.body;

    res.json(calculateSafetyScore({
      accidentFreeDays: accidentFreeDays !== undefined ? accidentFreeDays : 124,
      ppeComplianceRate: ppeComplianceRate !== undefined ? ppeComplianceRate : 98,
      safetyDrillsConducted: drills !== undefined ? drills : 4,
      unresolvedHazards: hazards !== undefined ? hazards : 0
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;