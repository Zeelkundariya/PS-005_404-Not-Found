const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  factoryId: String,
  name: String,
  uptimeHours: Number,
  breakdownCount: Number
});

module.exports = mongoose.model("Machine", machineSchema);