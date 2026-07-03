const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const User = require("../models/User");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const DIFFICULTY = {
  basic: "basic (fundamental definitions and recall level)",
  medium: "medium (applied understanding, requires some reasoning)",
  hard: "hard (deep understanding, tricky edge cases and problem solving)",
};

function getUserId(req) {
  const token =
    req.cookies?.token ||
    req.body?.token ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch (_) {
    return null;
  }
}

exports.generateQuiz = async (req, res) => {
  try {
    const { courseId, numQuestions, difficulty } = req.body;

    const userId = getUserId(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Please log in to generate a quiz" });
    }
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "courseId is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI is not configured. Please set GEMINI_API_KEY.",
      });
    }

    // Only enrolled students can quiz on a course
    const user = await User.findById(userId).select("courses");
    const owns = user?.courses?.some((id) => id.toString() === courseId);
    if (!owns) {
      return res.status(403).json({
        success: false,
        message: "Enroll in this course to take a quiz",
      });
    }

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection", select: "title description" },
      })
      .select("courseName courseDescription courseContent tag");

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Flatten whatever lecture content exists (may be sparse) as grounding
    let content = "";
    course.courseContent.forEach((sec) => {
      content += `Section: ${sec.sectionName}\n`;
      (sec.subSection || []).forEach((sub) => {
        content += `- ${sub.title}${sub.description ? ": " + sub.description : ""}\n`;
      });
    });

    const level = DIFFICULTY[difficulty] || DIFFICULTY.medium;
    const n = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 10);
    const topic = `${course.courseName}${
      course.tag?.length ? " (" + course.tag.join(", ") + ")" : ""
    }`;

    const prompt = `You are creating a multiple-choice quiz for a student in the course "${topic}".
Generate ${n} questions at ${level} difficulty.

Use the COURSE OUTLINE below as grounding for what the course covers. If the outline
is sparse, fall back to standard, widely-accepted questions about the course topic
itself - but keep everything relevant to "${course.courseName}".

Return an array of objects with this exact shape:
[{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"..."}]
Rules: exactly 4 options per question, one correct answerIndex (0-3), a short
explanation for the correct answer.

COURSE OUTLINE:
${content || "(no detailed outline provided - use the course topic)"}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (_) {
      text = text.replace(/```json|```/g, "").trim();
      quiz = JSON.parse(text);
    }

    if (!Array.isArray(quiz) || quiz.length === 0) {
      return res
        .status(502)
        .json({ success: false, message: "Could not build a quiz. Try again." });
    }

    return res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("Quiz error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate quiz" });
  }
};
