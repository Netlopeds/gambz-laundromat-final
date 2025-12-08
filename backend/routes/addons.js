const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addonController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.get('/', isAuthenticated, addonController.getAllAddons);
router.get('/:id', isAuthenticated, addonController.getAddonById);
router.post('/', isAuthenticated, isAdmin, addonController.createAddon);
router.put('/', isAuthenticated, isAdmin, addonController.updateAddon);
router.delete('/:id', isAuthenticated, isAdmin, addonController.deleteAddon);

module.exports = router;
