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
    if (!urlLong) return res.status(400).json({ message: "Url is required" });
    if (!isValidUrl(urlLong))
      return res.status(400).json({ message: "Invalid url" });
    const urlShort = generateRandomStr();
    const urlData = new shortUrlSchema({
      urlLong,
      urlShort,
      user: req.user?.id,
    });

    await urlData.save();
    res.status(201).json({
      longUrl: urlData.urlLong,
      shortUrl: urlData.urlShort,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const redirecUrl = async (req, res) => {
  try {
    const params = req.params;
    if (!params.id) {
      return res.status(400).json({ message: "URL id is required" });
    }
    const urlData = await shortUrlSchema.findOne({ urlShort: params.id });
    if (!urlData) {
      const clientUrl = process.env.CLIENT_URL || "/";
      return res.redirect(clientUrl);
      // Alternatively: return res.status(404).json({ message: "URL not found" });
    }
    if (urlData.user) {
      urlData.visitHistory.push({ visitTime: Date.now() });
      await urlData.save();
    }
    res.redirect(urlData.urlLong);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const getShortUrls = async (req, res) => {
  try {
    const user = req.user;
    const urlHistory = await shortUrlSchema.find({user: user.id}).select("-user");
    res.status(200).json(urlHistory)
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

const deleteShortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    console.log('Delete request received:', { id, userId: user?.id });
    
    if (!id) {
      return res.status(400).json({ message: "URL ID is required" });
    }
    
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Find the URL and verify it belongs to the user
    const urlData = await shortUrlSchema.findOne({ _id: id, user: user.id });
    
    if (!urlData) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }
    
    // Delete the URL from database
    await shortUrlSchema.findByIdAndDelete(id);
    
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { createShortUrl, redirecUrl, getShortUrls, deleteShortUrl };