const express = require('express');
const router = express.Router();
const assetController = require('../asset/assetController');

router.get('/', assetController.getAllAssets);
// router.get('/asset-owner/:id', assetController.getAssetById);
router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);
router.put('/update/:id', assetController.updateAsset);
router.delete('/delete/:id', assetController.deleteAssetById);
router.put('/delete-multiple', assetController.deleteMultipleAssets);
router.get('/assetpages', assetController.getAssetsByPage);
router.get('/assetstotal',assetController.totalAssetsCount);
router.get('/bulkinsert',assetController.bulkInsert);

module.exports = router;
