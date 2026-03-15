const express = require("express");
const router = express.Router();

const Machine = require("../models/Machine");

router.get("/status", async (req, res) => {
    try {
        // We simulate 15 machines for the hackathon "Live IoT" feel
        const machineNames = [
            "Loom #1 (Master)", "Loom #2", "Loom #3", 
            "Stenter #1", "Stenter #2", "Dyeing Jet #1",
            "Spinning Frame #1", "Spinning Frame #2", "Spinning Frame #3",
            "Carding Machine #1", "Draw Frame #1", "Rotor #1",
            "Finishing Machine", "Packaging Unit", "Quality Audit Station"
        ];

        const simulatedMachines = machineNames.map((name, index) => {
            const baseTemp = 45 + (index % 3) * 10;
            const temp = (baseTemp + Math.random() * 15).toFixed(1);
            const vibration = (Math.random() * 10).toFixed(2);
            const power = (5 + Math.random() * 20).toFixed(1); // kW
            const output = Math.floor(800 + Math.random() * 400); // Meters/hr
            const health = Math.floor(70 + Math.random() * 30);
            const failureProb = (Math.random() * 15).toFixed(1);
            
            let status = "Running";
            if (temp > 85 || vibration > 8) status = "Warning";
            if (health < 75 || failureProb > 12) status = "Maintenance";

            return {
                id: `SIM-${index + 1}`,
                name: name,
                status: status,
                health: health,
                temp: parseFloat(temp),
                vibration: parseFloat(vibration),
                power: parseFloat(power),
                output: output,
                failureProb: parseFloat(failureProb),
                rpm: Math.floor(800 + Math.random() * 400)
            };
        });

        res.json(simulatedMachines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;