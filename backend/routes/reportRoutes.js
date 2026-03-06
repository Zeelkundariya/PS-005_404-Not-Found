const express = require("express");
const router = express.Router();

router.get("/daily", (req, res) => {
    res.json({
        summary: "Production is steady at 84% efficiency. Energy costs are optimized for the current shift.",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;