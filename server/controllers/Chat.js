const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const ChatUsage = require("../models/ChatUsage");
const Course = require("../models/Course");
const User = require("../models/User");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const SYSTEM_PROMPT = `You are the AI assistant for CodeScholar, an online education platform.

You ONLY answer two kinds of questions:
1. About CodeScholar itself - its courses, enrollment, payments, the dashboard,
   becoming an instructor, tracking course progress, and account help.
2. General EDUCATION & studying - study tips, explaining academic concepts,
   learning strategies, and course/career guidance.

If a user asks anything UNRELATED to education or CodeScholar (sports, gossip,
politics, writing their personal essays/code, random trivia, etc.), politely
decline and steer them back, e.g. "I can only help with CodeScholar and
learning-related questions."

When answering about courses, use ONLY the data in "CURRENT COURSE CATALOG"
below. Never invent course names, instructors, or prices. If something is not
in the catalog, say you don't have that info and suggest browsing the catalog.

Keep answers concise, friendly, and helpful.`;

// Identify the requester: logged-in (by userId, 15/day) or anonymous (by IP, 5/day)
function identify(req) {
  const token =
    req.cookies?.token ||
    req.body?.token ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { key: decoded.id, userId: decoded.id, limit: 15, loggedIn: true };
    } catch (_) {
      // invalid/expired token -> treat as anonymous
    }
  }
  return { key: "ip:" + req.ip, userId: null, limit: 5, loggedIn: false };
}

// Compact catalog of published courses (name | instructor | price)
async function buildCatalogContext() {
  const courses = await Course.find({ status: "Published" })
    .populate("instructor", "firstName lastName")
    .select("courseName price instructor")
    .limit(40);

  if (!courses.length) return "No courses are currently published.";

  return courses
    .map(
      (c) =>
        `- ${c.courseName} | Instructor: ${c.instructor?.firstName || ""} ${
          c.instructor?.lastName || ""
        } | Price: Rs.${c.price}`
    )
    .join("\n");
}

// Lesson-level content for a course the user has PURCHASED
async function buildCourseContent(courseId, userId) {
  const user = await User.findById(userId).select("courses");
  const owns = user?.courses?.some((id) => id.toString() === courseId);
  if (!owns) return { owns: false };

  const course = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: { path: "subSection", select: "title description timeDuration" },
    })
    .select("courseName courseContent");

  if (!course) return { owns: false };

  let text = `COURSE: ${course.courseName}\n`;
  course.courseContent.forEach((sec, i) => {
    text += `Section ${i + 1}: ${sec.sectionName}\n`;
    (sec.subSection || []).forEach((sub, j) => {
      text += `  Lecture ${j + 1}: ${sub.title} (${sub.timeDuration || ""}) - ${
        sub.description || ""
      }\n`;
    });
  });
  return { owns: true, text };
}

exports.chat = async (req, res) => {
  try {
    const { messages, courseId } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Messages are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI is not configured. Please set GEMINI_API_KEY.",
      });
    }

    // ---- per-user daily limit ----
    const who = identify(req);
    const date = new Date().toISOString().slice(0, 10);
    const usage = await ChatUsage.findOne({ key: who.key, date });
    if (usage && usage.count >= who.limit) {
      return res.status(429).json({
        success: false,
        message: `You've reached your daily limit of ${who.limit} messages. Please try again tomorrow.`,
      });
    }

    // ---- build live context ----
    const catalog = await buildCatalogContext();
    let extra = "";
    if (courseId && who.loggedIn) {
      const cc = await buildCourseContent(courseId, who.userId);
      if (cc.owns) {
        extra =
          `\n\nThe user is currently viewing a course they have PURCHASED. ` +
          `You MAY answer detailed questions about its lessons below:\n${cc.text}`;
      } else {
        extra =
          `\n\nThe user is asking about a course they have NOT purchased. ` +
          `Politely tell them they need to enroll in this course to get lesson-specific help.`;
      }
    } else if (courseId && !who.loggedIn) {
      extra =
        `\n\nThe user is viewing a course page but is NOT logged in. ` +
        `Encourage them to log in and enroll to get lesson-specific help.`;
    }

    const systemInstruction = `${SYSTEM_PROMPT}\n\nCURRENT COURSE CATALOG:\n${catalog}${extra}`;

    // ---- call Gemini ----
    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });

    // Gemini uses roles "user"/"model" and history must start with a user turn
    let contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    while (contents.length && contents[0].role === "model") contents.shift();

    if (!contents.length) {
      return res
        .status(400)
        .json({ success: false, message: "No user message to respond to" });
    }

    const result = await model.generateContent({ contents });
    const text = result.response.text();

    // ---- record usage only after a successful reply ----
    await ChatUsage.findOneAndUpdate(
      { key: who.key, date },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    return res.status(200).json({ success: true, message: text });
  } catch (error) {
    console.error("Chat error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get AI response" });
  }
};
