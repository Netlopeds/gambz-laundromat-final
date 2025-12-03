const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.get('/', isAuthenticated, customerController.getAllCustomers);
router.get('/:id', isAuthenticated, customerController.getCustomerById);
router.post('/', isAuthenticated, customerController.createCustomer);
router.put('/:id', isAuthenticated, customerController.updateCustomer);
router.delete('/:id', isAuthenticated, isAdmin, customerController.deleteCustomer);

module.exports = router;
