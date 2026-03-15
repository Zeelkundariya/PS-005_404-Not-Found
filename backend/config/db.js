const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartfactory");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB error:", error);
  }
};

module.exports = connectDB;