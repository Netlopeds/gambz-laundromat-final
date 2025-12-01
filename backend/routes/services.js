const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', isAuthenticated, isAdmin, serviceController.createService);
router.put('/:id', isAuthenticated, isAdmin, serviceController.updateService);
router.delete('/:id', isAuthenticated, isAdmin, serviceController.deleteService);

module.exports = router;
