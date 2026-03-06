const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  deadline: Date,
  status: String
});

module.exports = mongoose.model("Order", orderSchema);