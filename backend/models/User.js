const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 * Defines the identity and role mapping for the SmartFactory environment
 */
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required for node identification"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Secure access crypt (password) required"] 
  },
  role: { 
    type: String, 
    enum: ["owner", "manager", "operator"], 
    default: "operator",
    required: true
  }
}, { 
  timestamps: true 
});

// Middleware: Hash access crypt before disk write
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Verify access crypt
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);