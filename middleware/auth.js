const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }
  const token =
    req.headers.authorization.split(" ")[1] ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .send({ error: "Token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
  return next();
};

module.exports = verifyToken;
