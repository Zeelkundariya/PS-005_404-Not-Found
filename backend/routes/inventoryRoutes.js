const express = require("express");
const router = express.Router();

const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

router.get("/alerts", async (req, res) => {
    try {
        const items = await Inventory.find();
        const alerts = items
            .filter(i => i.quantity < i.minThreshold)
            .map(i => ({
                _id: i._id,
                material: i.material,
                currentLevel: i.quantity,
                threshold: i.minThreshold,
                unit: i.material.includes("Chemical") ? "liters" : "kg"
            }));
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/summary", async (req, res) => {
    try {
        const orders = await Order.find();
        const inventory = await Inventory.find();

        const totalStockValue = inventory.reduce((acc, curr) => acc + (curr.quantity * 100), 0); // Simplified value calc
        const activeOrders = orders.filter(o => o.status !== "Completed").length;
        const pendingDeliveries = orders.filter(o => o.status === "Pending").length;

        res.json({
            totalStockValue,
            activeOrders,
            pendingDeliveries
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;