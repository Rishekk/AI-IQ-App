const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  
  // Answer tracking
  userAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  correctAnswer: { type: String, required: true },
  
  // Performance metrics
  timeSpent: { type: Number, required: true }, // in seconds
  confidence: { type: Number, min: 1, max: 5 }, // 1-5 scale
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  
  // Learning analytics
  attempts: { type: Number, default: 1 },
  hintsUsed: { type: Number, default: 0 },
  explanationViewed: { type: Boolean, default: false },
  
  // Timestamps
  answeredAt: { type: Date, default: Date.now },
  
  // Additional metadata
  category: { type: String, default: 'general' },
  topic: { type: String, default: 'general' },
  
}, { timestamps: true });

// Index for efficient queries
progressSchema.index({ user: 1, session: 1 });
progressSchema.index({ user: 1, answeredAt: -1 });
progressSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Progress", progressSchema); 