const express = require("express");
const { createShortUrl } = require("../controllers/shortUrlControllers");
const { authMiddleware } = require("../middleware/authMiddleware");
const route = express.Router();

route.post("/create", authMiddleware, createShortUrl);

module.exports = route;