const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', staffController.login);

// Protected routes - authentication required
router.get('/', isAuthenticated, staffController.getAllStaff);
router.get('/:id', isAuthenticated, staffController.getStaffById);
router.post('/', isAuthenticated, isAdmin, staffController.createStaff);
router.put('/:id', isAuthenticated, isAdmin, staffController.updateStaff);
router.delete('/:id', isAuthenticated, isAdmin, staffController.deleteStaff);

module.exports = router;
