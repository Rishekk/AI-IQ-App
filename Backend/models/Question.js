const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  question: String,
  answer: String,
  note: String,
  isPinned: { type: Boolean, default: false },
  // Progress tracking fields
  userAnswer: { type: String, default: null },
  isCorrect: { type: Boolean, default: null },
  timeSpent: { type: Number, default: 0 }, // in seconds
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, default: 'general' },
  attempts: { type: Number, default: 0 },
  lastAttempted: { type: Date, default: null },
  confidence: { type: Number, min: 1, max: 5, default: null }, // 1-5 scale
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);