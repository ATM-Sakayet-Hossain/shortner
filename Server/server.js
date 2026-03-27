const express = require("express");
const route = require("./router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConfig = require("./dbConfig");
require("dotenv").config();
const Port = process.env.PORT || 1993;

const app = express();
app.use(express.json());
app.use(cookieParser());
dbConfig();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shortner-client.vercel.app"
    ],
    withCredentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.set("trust proxy", 1); // proxy support (Vercel)
app.use(route);

app.listen(Port, () => {
  console.log(`Example app listening on port ${Port}`);
});
