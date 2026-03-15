const jwt = require("jsonwebtoken");

/**
 * Global Authentication Check
 * Verifies if the request has a valid industrial session token
 */
const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Authorization Denied: No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sf_industrial_secret_2026");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Authorization Denied: Token Invalid" });
  }
};

/**
 * Role-Based Access Control
 * @param {Array} allowedRoles - List of roles permitted to access the route
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access Denied: Required role [${allowedRoles.join("/")}] mismatch with user role [${req.user?.role || 'Guest'}]` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };