const express = require("express");
const router = express.Router();

const Machine = require("../models/Machine");

router.get("/status", async (req, res) => {
    try {
        const machines = await Machine.find();
        // Map to UI format
        const uiMachines = machines.map(m => ({
            id: m._id,
            name: m.name,
            status: m.breakdownCount > 5 ? "Maintenance" : "Running",
            health: Math.max(0, 100 - m.breakdownCount * 5),
            temp: 40 + Math.floor(Math.random() * 15)
        }));
        res.json(uiMachines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;