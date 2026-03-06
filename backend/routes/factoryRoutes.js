const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        name: "Surat Textile Cluster - Alpha",
        location: "Surat, Gujarat",
        capacity: "50,000 meters/day",
        established: "2018"
    });
});

router.get("/alerts", (req, res) => res.json([]));

module.exports = router;