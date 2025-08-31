const express = require('express');
const { 
  submitAnswer, 
  getUserAnalytics, 
  getSessionProgress, 
  updateExperienceLevel 
} = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Progress tracking routes
router.post('/submit-answer', submitAnswer);
router.get('/analytics', getUserAnalytics);
router.get('/session/:sessionId', getSessionProgress);
router.put('/experience-level', updateExperienceLevel);

module.exports = router; 