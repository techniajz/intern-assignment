const express = require('express');
const router = express.Router();
const EmployeeController = require('./EmployeeController');
const { validate } = require('../../util/validations');
const validations = require('./EmployeeValidations');
const { verifyToken } = require('../../util/auth');


router.post('/addEmployee',verifyToken,EmployeeController.addEmployee);
router.post('/editEmployee/:employeeId',verifyToken,EmployeeController.editEmployee);
router.get('/employeeDetails/:employeeId',verifyToken,EmployeeController.employeeDetails);
router.get('/allEmployee',verifyToken,EmployeeController.allEmployee);
router.delete('/deleteEmployee/:employeeId',verifyToken,EmployeeController.deleteEmployee);
router.post('/employeeStatus/:employeeId',verifyToken,EmployeeController.employeeStatus);
router.get('/profile',verifyToken,EmployeeController.profile);
router.post('/attendance',verifyToken,EmployeeController.attendance);
router.get('/attendanceList',verifyToken,EmployeeController.attendanceList);
router.get('/attendanceList/:empId',verifyToken,EmployeeController.attendanceList);
router.get('/checkDayAttendance/:empId',EmployeeController.checkDayAttendance);
router.get('/checkYesterdayAttendance/:empId',EmployeeController.checkYesterdayAttendance);
router.get('/getEmployeeAttendance',verifyToken,EmployeeController.getEmployeeAttendance);
router.post('/updateEmployeeAttendance',verifyToken, EmployeeController.updateEmployeeAttendance);
router.get('/employeeInfo/:employeeId',EmployeeController.employeeInfo);
router.post('/centralAttendance',EmployeeController.centralAttendance);
// router.get('/attendance/cron', EmployeeController.attendanceCron);
router.post('/attachment',verifyToken,EmployeeController.attachment);
router.get('/employeeAttachmentList',verifyToken,EmployeeController.employeeAttachmentList);
router.get('/TimelineActivity',verifyToken,EmployeeController.TimelineActivity);
router.post('/addHoliday',verifyToken,EmployeeController.addHoliday);
router.get('/CalendarList',verifyToken,EmployeeController.CalendarList);
router.delete('/deleteHoliday/:id', verifyToken, EmployeeController.deleteHoliday);
router.get('/leaveTypeDropdown',verifyToken,EmployeeController.leaveTypeDropdown);
router.post('/leaveRequest',verifyToken,EmployeeController.leaveRequest);
router.get('/leaveList',verifyToken,EmployeeController.leaveList);
router.post('/leaveStatus/:leaveId',verifyToken,EmployeeController.leaveStatus);
router.post('/sendMessage',verifyToken,EmployeeController.sendMessage);
router.get('/messageEmpList',verifyToken,EmployeeController.messageEmpList);
router.get('/messageList',verifyToken,EmployeeController.messageList);
router.get('/updateMessageStatus',verifyToken,EmployeeController.updateMessageStatus);
router.get('/admin_And_HR',verifyToken,EmployeeController.admin_And_HR);
router.post('/locationTruck',verifyToken,EmployeeController.locationTruck);
router.get('/notification',verifyToken,EmployeeController.notification);
router.get('/unreadNotifications',verifyToken,EmployeeController.unreadNotifications);
router.get('/appVersion',verifyToken,EmployeeController.appVersion);
//router.get('/getLocation/:employeeId',EmployeeController.locationData);
//router.get('/attendanceExport',EmployeeController.attendanceExport);

//Expenses
router.post('/addExpenses', verifyToken, EmployeeController.createExpenses);
router.put('/editExpenses/:expenseId', verifyToken, EmployeeController.updateExpenses);
router.delete('/deleteExpenses/:expenseId', verifyToken, EmployeeController.deleteExpenseById);
router.get('/fetchAllExpenses', verifyToken, EmployeeController.fetchAllExpense);
router.get('/getExpensesById/:expenseId', verifyToken, EmployeeController.getExpenseById);
router.get('/fetchExpensesByEmpId/:empId', verifyToken, EmployeeController.fetchExpenseByEmpId);
router.get('/exportExpense', verifyToken, EmployeeController.exportExpense);

module.exports = router;
