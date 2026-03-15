const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Initialize a new industrial node (User Registration)
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate redundancy
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Node already exists in database" });
    }

    // 2. Provision new user (Password hashing handled in Model)
    user = new User({ name, email, password, role });
    await user.save();

    // 3. Generate Auth Crypt (JWT)
    const payload = { 
      user: { 
        id: user.id, 
        role: user.role,
        name: user.name 
      } 
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "sf_industrial_secret_2026",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          token, 
          user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
      }
    );
  } catch (err) {
    console.error("Auth Register Error:", err.message);
    res.status(500).send("Node Provisioning Failure");
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authorize session (User Login)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verify Node identity
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Identity mismatch: Node not found" });
    }

    // 2. Validate Access Crypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Identity mismatch: Invalid password" });
    }

    // 3. Generate Auth Crypt (JWT)
    const payload = { 
      user: { 
        id: user.id, 
        role: user.role,
        name: user.name 
      } 
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "sf_industrial_secret_2026",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
      }
    );
  } catch (err) {
    console.error("Auth Login Error:", err.message);
    res.status(500).send("Authorization Logic Failure");
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Validate current session
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No session token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sf_industrial_secret_2026");
    const user = await User.findById(decoded.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: "Session expired or invalid" });
  }
});

module.exports = router;