const express = require('express');
const router = express.Router();
const editLogController = require('../controllers/editLogController');

router.get('/', editLogController.getAllEditLogs);
router.get('/transaction/:transactionId', editLogController.getEditLogsByTransaction);

module.exports = router;
