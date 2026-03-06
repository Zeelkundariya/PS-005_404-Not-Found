const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema({
  machineId: String,
  date: Date,
  shift: String,
  output: Number
});

module.exports = mongoose.model("ProductionLog", productionSchema);