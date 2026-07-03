const crypto = require("crypto");
const LiveClass = require("../models/LiveClass");
const Course = require("../models/Course");
const User = require("../models/User");

// Instructor schedules a live class for one of their own courses
exports.createLiveClass = async (req, res) => {
  try {
    const { courseId, title, description, scheduledAt } = req.body;
    const userId = req.user.id;

    if (!courseId || !title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "courseId, title and scheduledAt are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    if (course.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only schedule classes for your own courses",
      });
    }

    const roomName = `SN-${crypto.randomBytes(9).toString("hex")}`;

    const liveClass = await LiveClass.create({
      course: courseId,
      instructor: userId,
      title,
      description,
      scheduledAt,
      roomName,
    });

    return res.status(200).json({ success: true, liveClass });
  } catch (error) {
    console.error("createLiveClass error:", error);
    return res.status(500).json({ success: false, message: "Failed to create live class" });
  }
};

// Classes relevant to the logged-in user (instructor: own; student: enrolled courses)
exports.getMyLiveClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const accountType = req.user.accountType;

    let filter;
    if (accountType === "Instructor") {
      filter = { instructor: userId };
    } else {
      const user = await User.findById(userId).select("courses");
      filter = { course: { $in: user?.courses || [] } };
    }

    const classes = await LiveClass.find(filter)
      .populate("course", "courseName")
      .populate("instructor", "firstName lastName")
      .sort({ scheduledAt: 1 });

    return res.status(200).json({ success: true, classes });
  } catch (error) {
    console.error("getMyLiveClasses error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch live classes" });
  }
};

// Authorize a user to join, then hand back the room name
exports.joinLiveClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const userId = req.user.id;

    const liveClass = await LiveClass.findById(classId).populate("course", "courseName");
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }

    const isInstructor = liveClass.instructor.toString() === userId;

    let enrolled = false;
    if (!isInstructor) {
      const user = await User.findById(userId).select("courses");
      enrolled = user?.courses?.some(
        (id) => id.toString() === liveClass.course._id.toString()
      );
    }

    if (!isInstructor && !enrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to join the live class",
      });
    }

    return res.status(200).json({
      success: true,
      room: {
        roomName: liveClass.roomName,
        title: liveClass.title,
        courseName: liveClass.course.courseName,
      },
    });
  } catch (error) {
    console.error("joinLiveClass error:", error);
    return res.status(500).json({ success: false, message: "Failed to join live class" });
  }
};

// Instructor deletes their own class
exports.deleteLiveClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const userId = req.user.id;

    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }
    if (liveClass.instructor.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await LiveClass.findByIdAndDelete(classId);
    return res.status(200).json({ success: true, message: "Live class deleted" });
  } catch (error) {
    console.error("deleteLiveClass error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete live class" });
  }
};
