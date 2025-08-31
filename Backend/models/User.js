const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    // Progress tracking fields
    totalSessions: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    totalQuestionsCorrect: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    streakDays: { type: Number, default: 0 },
    preferredTopics: [{ type: String }],
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
