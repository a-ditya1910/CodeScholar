const express = require("express");
const router = express.Router();
const { streamVideo } = require("../controllers/VideoStream");
const { auth } = require("../middlewares/auth");

// stream the bytes - requires a valid login token in the Authorization header,
// so a copied URL / incognito (no auth) is rejected
router.get("/stream/:subSectionId", auth, streamVideo);

module.exports = router;
