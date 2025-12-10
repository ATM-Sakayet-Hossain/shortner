const { default: mongoose } = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  urlLong: {
    type: String,
    required: true,
  },
  urlShort: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  visitHistory: [
    {
      visitTime: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = mongoose.model("shorturl", shortUrlSchema);