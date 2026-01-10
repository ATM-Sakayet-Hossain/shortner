const express = require("express");
const { createShortUrl, getShortUrls } = require("../controllers/shortUrlControllers");
const { IsAuthMiddleware, authMiddleware } = require("../middleware/authMiddleware");
const route = express.Router();

route.post("/create", IsAuthMiddleware, createShortUrl);
route.get("/getall", authMiddleware, getShortUrls)


module.exports = route;