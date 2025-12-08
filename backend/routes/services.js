const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.get('/', isAuthenticated, serviceController.getAllServices);
router.get('/:id', isAuthenticated, serviceController.getServiceById);
router.post('/', isAuthenticated, isAdmin, serviceController.createService);
router.put('/:id', isAuthenticated, isAdmin, serviceController.updateService);
router.delete('/:id', isAuthenticated, isAdmin, serviceController.deleteService);

module.exports = router;
