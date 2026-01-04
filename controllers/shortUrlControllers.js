const { isValidUrl } = require("../utils/validation");
const shortUrlSchema = require("../models/shortUrlSchema");
const generateRandomStr = (length = 5) => {
  const charecters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomStr = "";
  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * charecters.length);
    randomStr += charecters[randomNum];
  }
  return randomStr;
};

const createShortUrl = async (req, res) => {
  try {
    const { urlLong } = req.body;
    console.log(req.user);
    if (!urlLong) return res.status(400).send({ message: "Url is required" });
    if (!isValidUrl(urlLong))
      return res.status(400).send({ message: "Invalid url" });
    const urlShort = generateRandomStr();
    const urlData = new shortUrlSchema({
      urlLong,
      urlShort,
    });
    urlData.save();
    res.status(201).send({
      longUrl: urlData.urlLong,
      shortUrl: urlData.urlShort,
    });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};
const redirecUrl = async (req, res) => {
  try {
    const params = req.params;
    if (!params.id) return;
    const urlData = await shortUrlSchema.findOne({ urlShort: params.id });
    if (!urlData) res.redirect(process.env.CLIENT_URL + urlData.urlShort);
    res.redirect(urlData.urlLong);
  } catch (error) {
    res.redirect(process.env.CLIENT_URL + urlData.urlShort);
  }
};

module.exports = { createShortUrl, redirecUrl };