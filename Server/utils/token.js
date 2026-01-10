const jwt = require("jsonwebtoken");
const generateAccTkn = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token
};
const virifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded
}

module.exports = { generateAccTkn, virifyToken };
