const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addonController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', addonController.getAllAddons);
router.get('/:id', addonController.getAddonById);
router.post('/', isAuthenticated, isAdmin, addonController.createAddon);
router.put('/:id', isAuthenticated, isAdmin, addonController.updateAddon);
router.delete('/:id', isAuthenticated, isAdmin, addonController.deleteAddon);

module.exports = router;
