const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const auth_token = req.header("x-auth-token");
  if (!auth_token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(auth_token, config.get("jwtPk"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send("Invalid token");
  }
}

module.exports = auth;
