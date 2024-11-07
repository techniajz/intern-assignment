const express = require('express');
const router = express.Router();
const assetController = require('../asset/assetController');

// router.get('/', assetController.getAllAssets);
router.get('/asset-owner/:id', assetController.getAssetById);
router.post('/', assetController.createAsset);
router.put('/update/:id', assetController.updateAsset);
router.delete('/delete/:id', assetController.deleteAssetById);
router.put('/delete-multiple', assetController.deleteMultipleAssets);

module.exports = router;
