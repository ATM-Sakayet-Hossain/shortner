const express = require("express");
const route = require("./router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./dbConfig");
require("dotenv").config();
const Port = process.env.PORT || 1993;

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://shortner-client.vercel.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

dbConfig();

app.use(route);

app.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
