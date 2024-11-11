const express = require('express');
const router = express.Router();
const assetController = require('../asset/assetController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', assetController.getAllAssets);
router.get('/asset-owner/:id', assetController.findUserById);
router.post('/createAsset', upload.single('img'), assetController.createAsset);
router.put('/update/:id', assetController.updateAsset);
router.delete('/delete/:id', assetController.deleteAssetById);
router.put('/delete-multiple', assetController.deleteMultipleAssets);
router.get('/assetpages', assetController.getAssetsByPage);
router.get('/assetstotal',assetController.totalAssetsCount);
router.get('/bulkinsert',assetController.bulkInsert);

module.exports = router;
