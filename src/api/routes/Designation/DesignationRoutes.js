const express = require('express');
const router = express.Router();
const DesignationController = require('./DesignationController');
const { validate } = require('../../util/validations');
const validations = require('./DesignationValidations');
const { verifyToken } = require('../../util/auth');

router.post('/createDesignation',validate(validations.designation, {}),verifyToken,DesignationController.createDesignation);
router.get('/designationList',verifyToken,DesignationController.designationList);
router.post('/editDesignation/:designationId',verifyToken,DesignationController.editDesignation);
router.post('/designationStatus/:designationId',verifyToken,DesignationController.designationStatus);

module.exports = router;
