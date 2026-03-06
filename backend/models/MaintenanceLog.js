const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  machineId: String,
  date: Date,
  note: String
});

module.exports = mongoose.model("MaintenanceLog", maintenanceSchema);