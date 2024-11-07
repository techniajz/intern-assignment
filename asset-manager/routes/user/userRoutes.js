const express = require('express');
const router = express.Router();
const userController = require('../user/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;
