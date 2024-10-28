const express = require('express');
const router = express.Router();
const SalaryController = require('./SalaryController');
const { verifyToken } = require('../../util/auth');

router.get('/calculateSalary',SalaryController.calculateSalary);
router.post('/leadClose_addIncentive',verifyToken,SalaryController.leadClose_addIncentive);
router.get('/salaryList',verifyToken,SalaryController.salaryList);
router.post('/advancedSalaries',verifyToken,SalaryController.advancedSalaries);
router.get('/salarySlip',SalaryController.salarySlip);

module.exports = router;
