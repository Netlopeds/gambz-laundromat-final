const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.get('/', isAuthenticated, transactionController.getAllTransactions);
router.get('/:id', isAuthenticated, transactionController.getTransactionById);
router.post('/', isAuthenticated, transactionController.createTransaction);
router.post('/import-csv', isAuthenticated, transactionController.importCSV);
router.put('/:id', isAuthenticated, transactionController.updateTransaction);
router.delete('/:id', isAuthenticated, isAdmin, transactionController.deleteTransaction);

module.exports = router;
