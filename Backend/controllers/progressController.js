const Progress = require("../models/Progress");
const User = require("../models/User");
const Session = require("../models/Session");
const Question = require("../models/Question");

// @desc    Submit answer and track progress
// @route   POST /api/progress/submit-answer
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, timeSpent, confidence, difficulty } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!sessionId || !questionId || !userAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the question to check if answer is correct
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Simple answer validation (you can enhance this with AI comparison)
    const isCorrect = userAnswer.toLowerCase().includes(question.answer.toLowerCase()) || 
                     question.answer.toLowerCase().includes(userAnswer.toLowerCase());

    // Create progress record
    const progress = await Progress.create({
      user: userId,
      session: sessionId,
      question: questionId,
      userAnswer,
      isCorrect,
      correctAnswer: question.answer,
      timeSpent: timeSpent || 0,
      confidence: confidence || 3,
      difficulty: difficulty || 'medium',
      category: question.category || 'general',
      topic: question.session?.topicsToFocus || 'general'
    });

    // Update question statistics
    question.attempts += 1;
    question.lastAttempted = new Date();
    question.userAnswer = userAnswer;
    question.isCorrect = isCorrect;
    question.timeSpent = (question.timeSpent || 0) + (timeSpent || 0);
    question.confidence = confidence || 3;
    await question.save();

    // Update session statistics
    const session = await Session.findById(sessionId);
    if (session) {
      session.questionsAnswered += 1;
      if (isCorrect) {
        session.questionsCorrect += 1;
      }
      session.score = Math.round((session.questionsCorrect / session.questionsAnswered) * 100);
      session.timeSpent = (session.timeSpent || 0) + (timeSpent || 0);
      
      // Mark session as completed if all questions answered
      if (session.questionsAnswered >= session.questions.length) {
        session.status = 'completed';
        session.completedAt = new Date();
      }
      
      await session.save();
    }

    // Update user statistics
    const user = await User.findById(userId);
    if (user) {
      user.totalQuestionsAnswered += 1;
      if (isCorrect) {
        user.totalQuestionsCorrect += 1;
      }
      user.averageScore = Math.round((user.totalQuestionsCorrect / user.totalQuestionsAnswered) * 100);
      user.lastActiveDate = new Date();
      
      // Update streak (simplified logic)
      const today = new Date().toDateString();
      const lastActive = user.lastActiveDate.toDateString();
      if (today !== lastActive) {
        user.streakDays += 1;
      }
      
      await user.save();
    }

    res.status(201).json({
      success: true,
      progress,
      isCorrect,
      sessionScore: session?.score || 0,
      userStats: {
        totalAnswered: user?.totalQuestionsAnswered || 0,
        totalCorrect: user?.totalQuestionsCorrect || 0,
        averageScore: user?.averageScore || 0,
        streakDays: user?.streakDays || 0
      }
    });

  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user progress analytics
// @route   GET /api/progress/analytics
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get progress data
    const progressData = await Progress.find({
      user: userId,
      answeredAt: { $gte: startDate }
    }).populate('session question');

    // Calculate analytics
    const totalQuestions = progressData.length;
    const correctAnswers = progressData.filter(p => p.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0;

    // Category breakdown
    const categoryStats = {};
    progressData.forEach(p => {
      const category = p.category || 'general';
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 };
      }
      categoryStats[category].total += 1;
      if (p.isCorrect) {
        categoryStats[category].correct += 1;
      }
    });

    // Convert to percentage
    Object.keys(categoryStats).forEach(category => {
      const { total, correct } = categoryStats[category];
      categoryStats[category] = {
        total,
        correct,
        accuracy: Math.round((correct / total) * 100)
      };
    });

    // Daily progress for charts
    const dailyProgress = {};
    progressData.forEach(p => {
      const date = p.answeredAt.toDateString();
      if (!dailyProgress[date]) {
        dailyProgress[date] = { total: 0, correct: 0 };
      }
      dailyProgress[date].total += 1;
      if (p.isCorrect) {
        dailyProgress[date].correct += 1;
      }
    });

    // Convert to array format for charts
    const dailyProgressArray = Object.entries(dailyProgress).map(([date, stats]) => ({
      date,
      total: stats.total,
      correct: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get user stats
    const user = await User.findById(userId);
    const userStats = {
      totalSessions: user?.totalSessions || 0,
      totalQuestionsAnswered: user?.totalQuestionsAnswered || 0,
      totalQuestionsCorrect: user?.totalQuestionsCorrect || 0,
      averageScore: user?.averageScore || 0,
      streakDays: user?.streakDays || 0,
      experienceLevel: user?.experienceLevel || 'beginner'
    };

    res.json({
      success: true,
      analytics: {
        timeframe,
        totalQuestions,
        correctAnswers,
        accuracy,
        totalTimeSpent,
        averageTimePerQuestion,
        categoryStats,
        dailyProgress: dailyProgressArray,
        userStats
      }
    });

  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get session progress
// @route   GET /api/progress/session/:sessionId
// @access  Private
exports.getSessionProgress = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(sessionId).populate('questions');
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user owns this session
    if (session.user.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Get progress for this session
    const progress = await Progress.find({
      user: userId,
      session: sessionId
    }).populate('question');

    // Calculate session statistics
    const totalQuestions = session.questions.length;
    const answeredQuestions = progress.length;
    const correctAnswers = progress.filter(p => p.isCorrect).length;
    const accuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    // Question-by-question progress
    const questionProgress = session.questions.map(q => {
      const questionProgress = progress.find(p => p.question._id.toString() === q._id.toString());
      return {
        questionId: q._id,
        question: q.question,
        isAnswered: !!questionProgress,
        isCorrect: questionProgress?.isCorrect || false,
        timeSpent: questionProgress?.timeSpent || 0,
        confidence: questionProgress?.confidence || null,
        answeredAt: questionProgress?.answeredAt || null
      };
    });

    res.json({
      success: true,
      sessionProgress: {
        sessionId,
        status: session.status,
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        accuracy,
        totalTimeSpent,
        score: session.score,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        questionProgress
      }
    });

  } catch (error) {
    console.error("Error getting session progress:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update user experience level
// @route   PUT /api/progress/experience-level
// @access  Private
exports.updateExperienceLevel = async (req, res) => {
  try {
    const { experienceLevel } = req.body;
    const userId = req.user._id;

    if (!experienceLevel || !['beginner', 'intermediate', 'advanced'].includes(experienceLevel)) {
      return res.status(400).json({ message: "Invalid experience level" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { experienceLevel },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error updating experience level:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}; 