const express = require('express');
const router = express.Router();
const editLogController = require('../controllers/editLogController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Admin-only routes (edit logs are sensitive audit data)
router.get('/', isAuthenticated, isAdmin, editLogController.getAllEditLogs);
router.get('/transaction/:transactionId', isAuthenticated, isAdmin, editLogController.getEditLogsByTransaction);

module.exports = router;
