const { verifyToken } = require("../utils/token");

const IsAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.acc_token;
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.acc_token;
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).send({ message: "Unauthorized Request" });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }
};

module.exports = { authMiddleware, IsAuthMiddleware };
