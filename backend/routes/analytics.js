const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/', analyticsController.getAllAnalytics);
router.get('/summary', analyticsController.getAnalyticsSummary);
router.post('/', analyticsController.generateAnalytics);

module.exports = router;
