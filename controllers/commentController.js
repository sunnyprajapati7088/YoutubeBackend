const axios = require("axios");
const Comment = require("../model/Comment");

exports.fetchComments = async (req, res) => {
  try {
    const { videoId } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;

    const response = await axios.get(youtubeUrl);
    const comments = response.data.items.map(item => ({
      videoId,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
    }));

    // Perform sentiment analysis using Gemini API
    for (let comment of comments) {
      const sentiment = await analyzeSentiment(comment.text);
      
      comment.sentiment = sentiment;
    }

    await Comment.insertMany(comments);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      "https://api.gemini.com/analyze",
      { text },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );
    return response.data.sentiment;
  } catch (error) {
    return "Neutral";
  }
}
