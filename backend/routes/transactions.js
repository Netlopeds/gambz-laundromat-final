const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes (anyone can view)
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);

// Protected routes (authentication required)
router.post('/', isAuthenticated, transactionController.createTransaction);
router.post('/import-csv', isAuthenticated, transactionController.importCSV);
router.put('/:id', isAuthenticated, transactionController.updateTransaction);
router.delete('/:id', isAuthenticated, isAdmin, transactionController.deleteTransaction);

module.exports = router;
