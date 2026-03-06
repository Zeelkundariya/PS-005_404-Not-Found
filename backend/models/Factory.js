const mongoose = require("mongoose");

const factorySchema = new mongoose.Schema({
  name: String,
  location: String,
  ownerId: String,
  targetOutput: { type: Number, default: 5000 },
  powerCostPerKwh: { type: Number, default: 8 },
  investmentCr: { type: Number, default: 10 },
  turnoverCr: { type: Number, default: 50 }
});

module.exports = mongoose.model("Factory", factorySchema);