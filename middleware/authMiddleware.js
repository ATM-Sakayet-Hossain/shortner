const { virifyToken } = require("../utils/token");

const IsAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.acc_token;
    const decoded = virifyToken(token);
    req.user = decoded
    next();
  } catch (error) {
    next();
  }
};
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.acc_token;
    const decoded = virifyToken(token);
    if(!decoded) return res.status(401).send({message: "Unauthorized Request"})
    req.user = decoded
    next();
  } catch (error) {
   res.status(500).send({message: "Unauthorize Request"})
  }
};

module.exports = { authMiddleware, IsAuthMiddleware };
