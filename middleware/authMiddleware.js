const { virifyToken } = require("../utils/token");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.acc_token;
    const decoded = virifyToken(token);
    req.user = decoded
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authMiddleware };
