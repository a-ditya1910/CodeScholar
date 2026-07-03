const express = require("express");
const router = express.Router();
const { getVideoOtp } = require("../controllers/VdoCipher");
const { auth } = require("../middlewares/auth");

router.post("/otp", auth, getVideoOtp);

module.exports = router;
