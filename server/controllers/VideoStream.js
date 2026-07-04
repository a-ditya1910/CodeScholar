const { Readable } = require("stream");
const User = require("../models/User");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// Streams a lecture's video through our backend, gated by login + enrollment.
// The request must carry the user's JWT in the Authorization header (sent by an
// authenticated fetch on the page). A copied URL opened in incognito or another
// browser has no auth header, so it is rejected with 401 - it cannot be played
// or downloaded.
exports.streamVideo = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    const { courseId } = req.query;
    const userId = req.user.id;

    if (!courseId) return res.status(400).send("courseId is required");

    const course = await Course.findById(courseId)
      .select("instructor courseContent")
      .populate({ path: "courseContent", select: "subSection" });
    if (!course) return res.status(404).send("Course not found");

    const isInstructor = course.instructor.toString() === userId;
    let enrolled = false;
    if (!isInstructor) {
      const user = await User.findById(userId).select("courses");
      enrolled = user?.courses?.some((id) => id.toString() === courseId);
    }
    if (!isInstructor && !enrolled) {
      return res.status(403).send("You must be enrolled to watch this video");
    }

    // the lecture must actually belong to this course
    const belongs = course.courseContent.some((sec) =>
      (sec.subSection || []).some((id) => id.toString() === subSectionId)
    );
    if (!belongs) return res.status(403).send("Invalid lecture");

    const subSection = await SubSection.findById(subSectionId).select("videoUrl");
    if (!subSection?.videoUrl) return res.status(404).send("Video not found");

    const range = req.headers.range;
    const upstream = await fetch(subSection.videoUrl, {
      headers: range ? { Range: range } : {},
    });

    res.status(upstream.status);
    ["content-type", "content-length", "content-range", "accept-ranges", "cache-control"].forEach(
      (h) => {
        const v = upstream.headers.get(h);
        if (v) res.setHeader(h, v);
      }
    );
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
