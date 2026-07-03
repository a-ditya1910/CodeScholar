const jwt = require("jsonwebtoken");
const { Readable } = require("stream");
const User = require("../models/User");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
require("dotenv").config();

// Step 1: an enrolled user (or the instructor) asks for a short-lived stream token
// bound to one specific lecture. Requires a valid login (auth middleware).
exports.getStreamToken = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    if (!courseId || !subSectionId) {
      return res
        .status(400)
        .json({ success: false, message: "courseId and subSectionId are required" });
    }

    const course = await Course.findById(courseId)
      .select("instructor courseContent")
      .populate({ path: "courseContent", select: "subSection" });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const isInstructor = course.instructor.toString() === userId;
    let enrolled = false;
    if (!isInstructor) {
      const user = await User.findById(userId).select("courses");
      enrolled = user?.courses?.some((id) => id.toString() === courseId);
    }
    if (!isInstructor && !enrolled) {
      return res
        .status(403)
        .json({ success: false, message: "Enroll in this course to watch this video" });
    }

    // the lecture must actually belong to this course
    const belongs = course.courseContent.some((sec) =>
      (sec.subSection || []).some((id) => id.toString() === subSectionId)
    );
    if (!belongs) {
      return res.status(403).json({ success: false, message: "Invalid lecture" });
    }

    // bind the token to the requester's IP so a copied link fails on another
    // device / network (stops casual link-sharing to friends)
    const streamToken = jwt.sign(
      { sub: subSectionId, ip: req.ip },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.status(200).json({ success: true, streamToken });
  } catch (error) {
    console.error("getStreamToken error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not authorize video" });
  }
};

// Step 2: the <video> element requests the bytes with ?vt=<streamToken>.
// We verify the token, then proxy the Cloudinary stream (with Range support for
// seeking). The Cloudinary URL is never exposed to the browser, and a shared
// link stops working once the short-lived token expires.
exports.streamVideo = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    const vt = req.query.vt;

    if (!vt) return res.status(401).send("Missing stream token");

    let payload;
    try {
      payload = jwt.verify(vt, process.env.JWT_SECRET);
    } catch (_) {
      return res.status(401).send("Invalid or expired stream token");
    }
    if (payload.sub !== subSectionId) return res.status(403).send("Forbidden");
    // reject if the token is replayed from a different device / network
    if (payload.ip && payload.ip !== req.ip) {
      return res.status(403).send("This link is not valid on this device");
    }

    const subSection = await SubSection.findById(subSectionId).select("videoUrl");
    if (!subSection?.videoUrl) return res.status(404).send("Video not found");

    const range = req.headers.range;
    const upstream = await fetch(subSection.videoUrl, {
      headers: range ? { Range: range } : {},
    });

    res.status(upstream.status);
    [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "cache-control",
      "etag",
      "last-modified",
    ].forEach((h) => {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    });
    res.setHeader("Content-Disposition", "inline");

    if (upstream.body) {
      Readable.fromWeb(upstream.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("streamVideo error:", error);
    return res.status(500).send("Failed to stream video");
  }
};
