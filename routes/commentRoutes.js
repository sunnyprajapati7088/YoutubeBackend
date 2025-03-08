const express = require("express");
const router = express.Router();
const { fetchComments } = require("../controllers/commentController");

router.get("/fetch-comments", fetchComments);

module.exports = router;
