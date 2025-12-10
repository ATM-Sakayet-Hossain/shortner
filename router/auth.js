const express = require("express");
const { registration, login } = require("../controllers/authContoller");
const route = express.Router();

route.post("/registration", registration);

route.post("/login", login);

module.exports = route;