const express = require('express');
const router = express.Router();
const AssetController = require('./AssetController.js');
const { verifyToken } = require('../../util/auth.js');

router.get('/getAssetById/:id', verifyToken, AssetController.getAssetById);
router.post('/addAsset', AssetController.addAsset);

module.exports = router;