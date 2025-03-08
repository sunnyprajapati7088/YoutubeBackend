const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  videoId: String,
  text: String,
  author: String,
  sentiment: String, // Positive, Negative, Neutral
});

module.exports = mongoose.model("Comment", commentSchema);
