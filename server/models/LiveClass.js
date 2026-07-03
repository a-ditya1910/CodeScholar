const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    scheduledAt: { type: Date, required: true },
    roomName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveClass", liveClassSchema);
