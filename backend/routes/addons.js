const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addonController');

router.get('/', addonController.getAllAddons);
router.get('/:id', addonController.getAddonById);
router.post('/', addonController.createAddon);
router.put('/:id', addonController.updateAddon);
router.delete('/:id', addonController.deleteAddon);

module.exports = router;
