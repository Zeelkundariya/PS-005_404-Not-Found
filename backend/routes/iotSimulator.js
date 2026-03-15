const express = require("express");
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// WORLD STATE — persistent in-memory model that drifts on every call
// so consecutive polls feel like a continuous live factory, not random jumps
// ─────────────────────────────────────────────────────────────────────────────
let state = {
  // Gauges
  avgTemp: 68, vibration: 45, productionSpeed: 87, gridPower: 42,
  yarnTension: 3.2, solarPercent: 38,

  // Overview KPIs
  pei: 82.4, maintenanceScore: 91.2, reliability: 94.5,
  activeWorkers: 48, outputToday: 12400, energyCost: 4.2,
  defectRate: 1.8, oeeScore: 78.5, digitalMaturity: 72,

  // PdM
  failureProbability: 30.2, healthScore: 82.5, remainingLifeHours: 1930,
  downtimePrevented: 148, backlogItems: 4, portfolioHealth: 91.5,

  // Supply chain
  yarnStockKg: 2840, waterUsageLiters: 1820, solarUnits: 142,
  wasteKg: 38, co2Saved: 12.4,

  // Finance
  revenueToday: 142000, costToday: 98000, exportScore: 74,

  // Safety
  accidentFreeDays: 124, ppeCompliance: 96, safetyScore: 94,

  // Scheduler
  unitUtilization: 88.4, makespan: 14.2, energyEfficiency: 92, activeOperators: 24,

  // Environmental
  airQualityIndex: 68, humidity: 52, ambientTemp: 31,

  // Inventory
  cottonYarnKg: 1850, polyesterKg: 640, dyesLiters: 380, packagingRolls: 220,

  // Quality
  qualityScore: 94.2, batchPassRate: 97.1, returnRate: 0.8,

  // Trends (rolling arrays)
  failureTrend: [
    { time: '08:00', risk: 20 }, { time: '10:00', risk: 25 },
    { time: '12:00', risk: 45 }, { time: '14:00', risk: 30 },
    { time: '16:00', risk: 35 }, { time: '18:00', risk: 60 },
    { time: '20:00', risk: 30 },
  ],
  peiTrend: [78, 80, 79, 81, 82, 82.4],
  waterTrend: [1800, 1780, 1820, 1760, 1790, 1840, 1820],
  efficiencyTrend: [
    { time: '0H', efficiency: 85 }, { time: '4H', efficiency: 88 },
    { time: '8H', efficiency: 82 }, { time: '12H', efficiency: 94 },
    { time: '16H', efficiency: 91 }, { time: '20H', efficiency: 89 },
    { time: '24H', efficiency: 95 },
  ],
  productionTrend: [
    { month: 'Oct', output: 11200 }, { month: 'Nov', output: 11800 },
    { month: 'Dec', output: 10900 }, { month: 'Jan', output: 12100 },
    { month: 'Feb', output: 12400 }, { month: 'Mar', output: 13100 },
  ],
  revenueTrend: [
    { day: 'Mon', rev: 128000 }, { day: 'Tue', rev: 135000 },
    { day: 'Wed', rev: 121000 }, { day: 'Thu', rev: 145000 },
    { day: 'Fri', rev: 138000 }, { day: 'Sat', rev: 152000 },
    { day: 'Sun', rev: 142000 },
  ],

  // Scheduler machine state
  machineLoads: [85, 0, 92, 15, 60],
  machineHealths: [95, 42, 88, 99, 91],
};

let schedulerLogs = [];
let tick = 0;

const drift = (v, d, min, max) => Math.round(Math.min(max, Math.max(min, v + (Math.random() * 2 - 1) * d)) * 10) / 10;
const driftInt = (v, d, min, max) => Math.round(drift(v, d, min, max));
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const pct = (v) => `${v}%`;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/iot/live  — master data bus, called every 2.5 s
// ─────────────────────────────────────────────────────────────────────────────
router.get("/live", (req, res) => {
  tick++;

  // ── drift all state values ────────────────────────────────────────────────
  state.avgTemp            = drift(state.avgTemp,           2,   35, 105);
  state.vibration          = drift(state.vibration,         4,    5, 115);
  state.productionSpeed    = drift(state.productionSpeed,   1.5, 60,  99);
  state.gridPower          = drift(state.gridPower,         2,   20,  80);
  state.yarnTension        = drift(state.yarnTension,       0.2,  1,   6);
  state.solarPercent       = drift(state.solarPercent,      2,   10,  65);

  state.pei               = drift(state.pei,               0.4, 70,  95);
  state.maintenanceScore  = drift(state.maintenanceScore,  0.5, 75,  99);
  state.reliability       = drift(state.reliability,       0.3, 80,  99);
  state.activeWorkers     = driftInt(state.activeWorkers,  1,   40,  56);
  state.outputToday       = driftInt(state.outputToday,    60, 10000, 16000);
  state.energyCost        = drift(state.energyCost,        0.1,  3.5, 6.2);
  state.defectRate        = drift(state.defectRate,        0.15, 0.3,  5.0);
  state.oeeScore          = drift(state.oeeScore,          0.8,  65,  95);
  state.digitalMaturity   = drift(state.digitalMaturity,   0.3,  60,  90);

  state.failureProbability = drift(state.failureProbability, 1.5, 8,   55);
  state.healthScore        = drift(state.healthScore,        0.8, 65,  98);
  state.remainingLifeHours = driftInt(state.remainingLifeHours, 4, 800, 2500);
  state.downtimePrevented  = driftInt(state.downtimePrevented, 1, 100, 300);
  state.backlogItems       = driftInt(state.backlogItems,    1,   1,  12);
  state.portfolioHealth    = drift(state.portfolioHealth,    0.5, 80,  99);

  state.yarnStockKg        = driftInt(state.yarnStockKg,   25, 1000, 4500);
  state.waterUsageLiters   = driftInt(state.waterUsageLiters, 30, 1200, 2800);
  state.solarUnits         = driftInt(state.solarUnits,     6,  60,  280);
  state.wasteKg            = driftInt(state.wasteKg,        2,  15,  90);
  state.co2Saved           = drift(state.co2Saved,          0.4, 4,   30);

  state.revenueToday       = driftInt(state.revenueToday,  600, 95000, 260000);
  state.costToday          = driftInt(state.costToday,     250, 65000, 190000);
  state.exportScore        = driftInt(state.exportScore,    1,  50,   92);

  state.ppeCompliance      = drift(state.ppeCompliance,     0.5, 85, 100);
  state.safetyScore        = drift(state.safetyScore,       0.5, 80, 100);

  state.unitUtilization    = drift(state.unitUtilization,   0.5, 75,  98);
  state.makespan           = drift(state.makespan,          0.2, 10,  20);
  state.energyEfficiency   = drift(state.energyEfficiency,  0.4, 80,  98);
  state.activeOperators    = driftInt(state.activeOperators, 1,  18,  30);

  state.airQualityIndex    = driftInt(state.airQualityIndex, 3, 30,  120);
  state.humidity           = drift(state.humidity,           1, 35,   80);
  state.ambientTemp        = drift(state.ambientTemp,        0.5, 26, 42);

  state.cottonYarnKg       = driftInt(state.cottonYarnKg,  15, 800, 3000);
  state.polyesterKg        = driftInt(state.polyesterKg,    8, 300, 1200);
  state.dyesLiters         = driftInt(state.dyesLiters,     5, 180,  600);
  state.packagingRolls     = driftInt(state.packagingRolls,  3,  80,  400);

  state.qualityScore       = drift(state.qualityScore,      0.3, 88,  99);
  state.batchPassRate      = drift(state.batchPassRate,      0.2, 93,  99);
  state.returnRate         = drift(state.returnRate,         0.05, 0.2,  3);

  // ── rolling trend arrays ─────────────────────────────────────────────────
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  state.failureTrend  = [...state.failureTrend.slice(-6),   { time: now, risk: Math.round(drift(state.failureTrend.slice(-1)[0].risk, 8, 8, 80)) }];
  state.peiTrend      = [...state.peiTrend.slice(-5),       state.pei];
  state.waterTrend    = [...state.waterTrend.slice(-6),      state.waterUsageLiters];

  // efficiency chart drifts last point
  const lastEff = state.efficiencyTrend.slice(-1)[0];
  state.efficiencyTrend = [...state.efficiencyTrend.slice(-6), { time: now, efficiency: Math.round(drift(lastEff.efficiency, 3, 75, 99)) }];

  // revenue trend drifts today's value
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = days[new Date().getDay()];
  state.revenueTrend = state.revenueTrend.map(d => d.day === today ? { ...d, rev: state.revenueToday } : d);

  // ── scheduler machine loads ───────────────────────────────────────────────
  state.machineLoads   = state.machineLoads.map((l, i) => i === 1 ? 0 : driftInt(l, 3, 10, 100));
  state.machineHealths = state.machineHealths.map(h => driftInt(h, 1, 35, 100));

  // ── periodic scheduler log events ─────────────────────────────────────────
  if (tick % 4 === 0) {
    const logMessages = [
      { time: now, msg: `Neural Sync: Loom rotation adjusted (+${(Math.random()*3).toFixed(1)}% throughput)`, type: 'success' },
      { time: now, msg: `Grid: Peak load ${(state.gridPower).toFixed(0)} kW detected. Load-balancing active.`, type: 'alert' },
      { time: now, msg: `Job J${Math.floor(Math.random()*100+200)} Weaving Phase initiated. ETA ${Math.floor(Math.random()*8+2)}h.`, type: 'info' },
      { time: now, msg: `Scheduler: GAN baseline recalculated — makespan ${state.makespan.toFixed(1)}h`, type: 'info' },
      { time: now, msg: `Quality AI: Batch pass rate ${state.batchPassRate.toFixed(1)}% — within spec`, type: 'success' },
      { time: now, msg: `PdM Agent: ${state.backlogItems} work orders pending. Dispatching technician.`, type: 'alert' },
    ];
    schedulerLogs = [logMessages[Math.floor(Math.random() * logMessages.length)], ...schedulerLogs.slice(0, 19)];
  }

  // ── 15 machines ─────────────────────────────────────────────────────────
  const machineNames = [
    "Loom #1 (Master)", "Loom #2", "Loom #3",
    "Stenter #1", "Stenter #2", "Dyeing Jet #1",
    "Spinning Frame #1", "Spinning Frame #2", "Spinning Frame #3",
    "Carding Machine #1", "Draw Frame #1", "Rotor #1",
    "Finishing Machine", "Packaging Unit", "Quality Audit Station"
  ];
  const machines = machineNames.map((name, i) => {
    const base   = 45 + (i % 3) * 10;
    const temp   = parseFloat((base + Math.random() * 18).toFixed(1));
    const vib    = parseFloat((Math.random() * 10.5).toFixed(2));
    const power  = parseFloat((4 + Math.random() * 22).toFixed(1));
    const output = Math.floor(800 + Math.random() * 450);
    const health = Math.floor(68 + Math.random() * 32);
    const failP  = parseFloat((Math.random() * 16).toFixed(1));
    const rpm    = Math.floor(780 + Math.random() * 420);
    let status   = "Running";
    if (temp > 85 || vib > 8) status = "Warning";
    if (health < 74 || failP > 12) status = "Maintenance";
    return { id: `SIM-${i + 1}`, name, status, health, temp, vibration: vib, power, output, failureProb: failP, rpm };
  });

  const liveTempNow     = drift(state.avgTemp, 4, 28, 112);
  const liveVibNow      = drift(state.vibration / 10, 0.4, 0.3, 12);
  const livePressNow    = drift(120, 9, 88, 165);
  const livePowerNow    = drift(state.gridPower * 0.35, 1.2, 4, 32);

  const yarnStatus      = state.yarnStockKg < 1800 ? "Critical" : state.yarnStockKg < 2500 ? "Low" : "Normal";
  const warnCount       = machines.filter(m => m.status === "Warning").length;
  const maintCount      = machines.filter(m => m.status === "Maintenance").length;
  const profit          = state.revenueToday - state.costToday;

  // ── scheduler data ───────────────────────────────────────────────────────
  const machineStatuses = ['Running', 'Maintenance', 'Running', 'Idle', 'Running'];
  const schedulerMachines = [
    { id: 'M1', name: 'Loom #01 (Jacquard)',       status: machineStatuses[0], health: state.machineHealths[0], color: '#3b82f6', load: state.machineLoads[0] },
    { id: 'M2', name: 'Loom #04 (Dobby)',           status: machineStatuses[1], health: state.machineHealths[1], color: '#f59e0b', load: 0 },
    { id: 'M3', name: 'Stenter #01 (Finishing)',    status: machineStatuses[2], health: state.machineHealths[2], color: '#10b981', load: state.machineLoads[2] },
    { id: 'M4', name: 'Dyeing Jar #02',             status: machineStatuses[3], health: state.machineHealths[3], color: '#8b5cf6', load: state.machineLoads[3] },
    { id: 'M5', name: 'Inspection #03',             status: machineStatuses[4], health: state.machineHealths[4], color: '#ec4899', load: state.machineLoads[4] },
  ];

  res.json({
    timestamp: new Date().toISOString(),

    // gauges
    gauges: {
      avgTemp: state.avgTemp,
      vibration: state.vibration,
      productionSpeed: state.productionSpeed,
      gridPower: state.gridPower,
      yarnTension: state.yarnTension,
      solarPercent: state.solarPercent,
    },

    // kpis
    kpis: {
      pei:              state.pei,
      peiTrend:         state.peiTrend,
      maintenanceScore: state.maintenanceScore,
      reliability:      state.reliability,
      activeWorkers:    state.activeWorkers,
      outputToday:      state.outputToday,
      energyCost:       state.energyCost,
      defectRate:       state.defectRate,
      oeeScore:         state.oeeScore,
      digitalMaturity:  state.digitalMaturity,
    },

    // pdm
    pdm: {
      failureProbability:     state.failureProbability,
      healthScore:            state.healthScore,
      remainingLifeHours:     state.remainingLifeHours,
      downtimePrevented:      state.downtimePrevented,
      backlogItems:           state.backlogItems,
      portfolioHealth:        state.portfolioHealth,
      failureTrend:           state.failureTrend,
      productionLossEstimate: inr(Math.floor(state.failureProbability * 1800)),
      netSavingsPotential:    inr(Math.floor(state.healthScore * 900)),
      revenueAtRisk:          inr(Math.floor(state.failureProbability * 28000)),
      techAvailability:       pct(driftInt(75, 2, 60, 95)),
    },

    // live sensors (pdm tab)
    liveSensors: {
      temp:           parseFloat(liveTempNow.toFixed(1)),
      tempTrend:      parseFloat((Math.random() * 4 - 2).toFixed(1)),
      vibration:      parseFloat(liveVibNow.toFixed(2)),
      vibrationTrend: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      pressure:       parseFloat(livePressNow.toFixed(0)),
      power:          parseFloat(livePowerNow.toFixed(1)),
    },

    // machines
    machines,
    machineAlerts: { warning: warnCount, maintenance: maintCount },

    // sustainability
    sustainability: {
      waterUsage:   state.waterUsageLiters,
      waterTrend:   state.waterTrend,
      solarUnits:   state.solarUnits,
      solarPercent: state.solarPercent,
      wasteKg:      state.wasteKg,
      co2Saved:     state.co2Saved,
      airQuality:   state.airQualityIndex,
      humidity:     parseFloat(state.humidity.toFixed(1)),
      ambientTemp:  parseFloat(state.ambientTemp.toFixed(1)),
    },

    // supply chain
    supplyChain: {
      yarnStockKg:  state.yarnStockKg,
      yarnStatus,
      inventory: {
        cottonYarnKg:     state.cottonYarnKg,
        polyesterKg:      state.polyesterKg,
        dyesLiters:       state.dyesLiters,
        packagingRolls:   state.packagingRolls,
      },
    },

    // finance
    finance: {
      revenueToday:   state.revenueToday,
      costToday:      state.costToday,
      profitToday:    profit,
      exportScore:    state.exportScore,
      revenueFmt:     inr(state.revenueToday),
      costFmt:        inr(state.costToday),
      profitFmt:      inr(profit),
      revenueTrend:   state.revenueTrend,
      productionTrend: state.productionTrend,
      profitMargin:   parseFloat(((profit / state.revenueToday) * 100).toFixed(1)),
    },

    // safety
    safety: {
      accidentFreeDays: state.accidentFreeDays,
      ppeCompliance:    parseFloat(state.ppeCompliance.toFixed(1)),
      safetyScore:      parseFloat(state.safetyScore.toFixed(1)),
    },

    // quality
    quality: {
      score:        parseFloat(state.qualityScore.toFixed(1)),
      batchPassRate: parseFloat(state.batchPassRate.toFixed(1)),
      returnRate:   parseFloat(state.returnRate.toFixed(2)),
      defectRate:   parseFloat(state.defectRate.toFixed(2)),
    },

    // scheduler
    scheduler: {
      unitUtilization:  parseFloat(state.unitUtilization.toFixed(1)),
      makespan:         parseFloat(state.makespan.toFixed(1)),
      energyEfficiency: parseFloat(state.energyEfficiency.toFixed(1)),
      activeOperators:  state.activeOperators,
      machines:         schedulerMachines,
      logs:             schedulerLogs.slice(0, 8),
      efficiencyTrend:  state.efficiencyTrend,
    },
  });
});

module.exports = router;
