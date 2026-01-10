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
    if (!urlLong) return res.status(400).send({ message: "Url is required" });
    if (!isValidUrl(urlLong))
      return res.status(400).send({ message: "Invalid url" });
    const urlShort = generateRandomStr();
    const urlData = new shortUrlSchema({
      urlLong,
      urlShort,
      user: req.user?.id,
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
    if (urlData.user){
      urlData.visitHistory.push({visitTime: Date.now()});
      urlData.save()
    }
    res.redirect(urlData.urlLong);
  } catch (error) {
    res.redirect(process.env.CLIENT_URL + urlData.urlShort);
  }
};
const getShortUrls = async (req, res) => {
  try {
    const user = req.user;
    const urlHistory = await shortUrlSchema.find({user: user.id}).select("-user");
    res.status(200).send(urlHistory)
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createShortUrl, redirecUrl, getShortUrls };