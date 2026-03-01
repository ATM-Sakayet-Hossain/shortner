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
    res.status(500).send({ message: "Server Error" });
  }
};
const getShortUrls = async (req, res) => {
  try {
    const user = req.user;
    const urlHistory = await shortUrlSchema.find({user: user.id}).select("-user");
    res.status(200).send(urlHistory)
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
}

const deleteShortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    console.log('Delete request received:', { id, userId: user?.id });
    
    if (!id) {
      return res.status(400).send({ message: "URL ID is required" });
    }
    
    if (!user || !user.id) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    
    // Find the URL and verify it belongs to the user
    const urlData = await shortUrlSchema.findOne({ _id: id, user: user.id });
    
    if (!urlData) {
      return res.status(404).send({ message: "URL not found or unauthorized" });
    }
    
    // Delete the URL from database
    await shortUrlSchema.findByIdAndDelete(id);
    
    res.status(200).send({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
}

module.exports = { createShortUrl, redirecUrl, getShortUrls, deleteShortUrl };