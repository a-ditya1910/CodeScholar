const express = require("express");
const router = express.Router();
const { getStreamToken, streamVideo } = require("../controllers/VideoStream");
const { auth } = require("../middlewares/auth");

// mint a short-lived token (requires login + enrollment)
router.post("/token", auth, getStreamToken);

// stream the bytes using ?vt=<token> (the <video> element can't send headers)
router.get("/stream/:subSectionId", streamVideo);

module.exports = router;
