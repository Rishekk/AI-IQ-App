const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  topicsToFocus: { type: String, required: true },
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  // Progress tracking fields
  status: { type: String, enum: ['in-progress', 'completed', 'paused'], default: 'in-progress' },
  totalQuestions: { type: Number, default: 0 },
  questionsAnswered: { type: Number, default: 0 },
  questionsCorrect: { type: Number, default: 0 },
  score: { type: Number, default: 0 }, // percentage
  timeSpent: { type: Number, default: 0 }, // total time in seconds
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, default: 'general' },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
