const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { isAuthenticated } = require('../middleware/auth');

// All routes require authentication
router.get('/', isAuthenticated, analyticsController.getAllAnalytics);
router.get('/summary', isAuthenticated, analyticsController.getAnalyticsSummary);
router.post('/', isAuthenticated, analyticsController.generateAnalytics);

module.exports = router;
