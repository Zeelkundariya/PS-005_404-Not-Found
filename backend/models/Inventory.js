const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  material: String,
  quantity: Number,
  minThreshold: Number
});

module.exports = mongoose.model("Inventory", inventorySchema);