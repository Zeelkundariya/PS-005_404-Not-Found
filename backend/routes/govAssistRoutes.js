const express = require("express");
const router = express.Router();
const govAssistAI = require("../ai/govAssistAI");
const Factory = require("../models/Factory");

// Helper to simulate "Live IoT Data" for AI consumption
// In a real app, this would fetch from a cache or the IoT Gateway
const getLiveIotSnapshot = () => ({
  sustainability: {
    waterUsage: 1800 + Math.random() * 1000,
    airQuality: 65 + Math.random() * 30,
    co2Saved: 12.4
  },
  kpis: {
    activeWorkers: 45 + Math.floor(Math.random() * 10),
    maintenanceScore: 88 + Math.random() * 10,
    outputToday: 12400 + Math.random() * 2000,
    oeeScore: 78 + Math.random() * 15,
    pei: 82 + Math.random() * 10
  },
  safety: {
    safetyScore: 92 + Math.random() * 5,
    ppeCompliance: 94 + Math.random() * 5,
    accidentFreeDays: 124
  },
  gauges: {
    avgTemp: 68 + Math.random() * 20,
    solarPercent: 35 + Math.random() * 15
  }
});

// GET /api/govassist/compliance-status
router.get("/compliance-status", async (req, res) => {
  try {
    const factory = await Factory.findOne() || { investmentCr: 10, turnoverCr: 50 };
    const iotData = getLiveIotSnapshot();
    const result = govAssistAI.getComplianceStatus(factory, iotData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/govassist/scheme-eligibility
router.get("/scheme-eligibility", async (req, res) => {
  try {
    const factory = await Factory.findOne() || { name: "Bhilwara Textiles", investmentCr: 12, turnoverCr: 45 };
    const result = govAssistAI.getSchemeEligibility(factory);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/govassist/inspection-readiness
router.get("/inspection-readiness", async (req, res) => {
  try {
    const iotData = getLiveIotSnapshot();
    const result = govAssistAI.getInspectionReadiness(iotData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/govassist/generate-report
router.get("/generate-report", async (req, res) => {
  try {
    const { type } = req.query;
    const factory = await Factory.findOne() || { name: "Bhilwara Smart Textiles" };
    const iotData = getLiveIotSnapshot();
    const result = govAssistAI.generateReport(type || "production", iotData, factory);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
