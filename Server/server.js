const express = require('express')
const route = require('./router')
const cookieParser = require('cookie-parser')
const dbConfig = require('./dbConfig')
require('dotenv').config()
const {isValidUrl} = require('./utils/validation')
const app = express()
app.use(express.json())
app.use(cookieParser())
dbConfig();

app.use(route)

app.listen(1993, () => {
  console.log(`Example app listening on port 1993`)
})
