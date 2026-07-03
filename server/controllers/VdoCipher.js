const User = require("../models/User");
require("dotenv").config();

// Returns a short-lived OTP + playbackInfo for a DRM-encrypted VdoCipher video,
// but ONLY to a user enrolled in the course that owns the video.
exports.getVideoOtp = async (req, res) => {
  try {
    const { courseId, videoId } = req.body;
    const userId = req.user.id;

    if (!videoId || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "courseId and videoId are required" });
    }
    if (!process.env.VDOCIPHER_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: "DRM is not configured. Set VDOCIPHER_API_SECRET.",
      });
    }

    // Verify enrollment
    const user = await User.findById(userId).select("courses");
    const enrolled = user?.courses?.some((id) => id.toString() === courseId);
    if (!enrolled) {
      return res.status(403).json({
        success: false,
        message: "Enroll in this course to watch this video",
      });
    }

    // Ask VdoCipher for a short-lived OTP (ttl in seconds)
    const response = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        method: "POST",
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ttl: 300 }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("VdoCipher OTP error:", response.status, text);
      return res
        .status(502)
        .json({ success: false, message: "Could not get video playback token" });
    }

    const data = await response.json(); // { otp, playbackInfo }
    return res.status(200).json({
      success: true,
      otp: data.otp,
      playbackInfo: data.playbackInfo,
    });
  } catch (error) {
    console.error("getVideoOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load protected video" });
  }
};
