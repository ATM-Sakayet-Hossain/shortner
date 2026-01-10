const express = require("express");
const { registration, login, getProfile } = require("../controllers/authContoller");
const { authMiddleware } = require("../middleware/authMiddleware");
const route = express.Router();

route.post("/registration", registration);
route.post("/login", login);
route.get("/getProfile", authMiddleware, getProfile);

module.exports = route;