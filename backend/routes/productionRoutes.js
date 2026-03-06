const express = require("express");
const router = express.Router();

const ProductionLog = require("../models/ProductionLog");

router.get("/stats", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logs = await ProductionLog.find({ date: { $gte: today } });
        const currentOutput = logs.reduce((acc, log) => acc + log.output, 0);
        const dailyTarget = 5000; // Factory-wide target

        res.json({
            dailyTarget,
            currentOutput,
            shiftsActive: 3,
            efficiency: Math.round((currentOutput / dailyTarget) * 100)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;