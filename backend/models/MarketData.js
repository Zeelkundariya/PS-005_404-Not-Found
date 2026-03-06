const mongoose = require("mongoose");

const marketDataSchema = new mongoose.Schema({
    commodity: String,
    price: Number,
    unit: String,
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MarketData", marketDataSchema);
