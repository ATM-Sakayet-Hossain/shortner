const express = require("express");
const route = require("./router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./dbConfig");
require("dotenv").config();
const { isValidUrl } = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow frontend to talk to this server
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

dbConfig();

app.use(route);

app.listen(1993, () => {
  console.log(`Example app listening on port 1993`);
});
