const express = require("express");
const route = require("./router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./dbConfig");
require("dotenv").config();
const { isValidUrl } = require("./utils/validation");
const Port = process.env.PORT || 1993

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://shortner-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

dbConfig();

app.use(route);

app.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
