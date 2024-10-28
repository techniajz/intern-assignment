const express = require('express');
const router = express.Router();
const ProjectController = require('./ProjectController');
const { validate } = require('../../util/validations');
const validations = require('./ProjectValidations');
const { verifyToken } = require('../../util/auth');

router.get('/propertyType',verifyToken,ProjectController.propertyType);
router.get('/propertyConditions',verifyToken,ProjectController.propertyConditions);
router.get('/ownershipType',verifyToken,ProjectController.ownershipType);
router.post('/createProject',verifyToken,ProjectController.createProject);
router.get('/projectList',verifyToken,ProjectController.projectList);
router.get('/projectStatus/:projectId',verifyToken,ProjectController.projectStatus);
router.get('/projectImageList/:projectId',verifyToken,ProjectController.projectImageList);
router.post('/addProjectImage/:projectId',verifyToken,ProjectController.addProjectImage);
router.post('/projectProfileUpdate/:projectId/:imageId',verifyToken,ProjectController.projectProfileUpdate);
router.delete('/deleteProjectImage/:projectId/:imageId',verifyToken,ProjectController.deleteProjectImage);
router.post('/editProject/:projectId',verifyToken,ProjectController.editProject);
router.get('/employeeList',verifyToken,ProjectController.employeeList);
router.post('/assignProject',verifyToken,ProjectController.assignProject);
router.get('/assignedToEmployeeList/:projectId',verifyToken,ProjectController.assignedToEmployeeList);
router.delete('/deleteAssignedEmployee/:AssignedEmpId',verifyToken,ProjectController.deleteAssignedEmployee);
router.delete('/deleteProject/:projectId',verifyToken,ProjectController.deleteProject);
router.get('/certificateDropdrone',verifyToken,ProjectController.certificateDropdrone);
router.get('/projectSize',verifyToken,ProjectController.projectSize);
router.post('/addFlatSize/:projectId',verifyToken,ProjectController.addFlatSize);
router.get('/projectAssignedToEmployee/:empId',verifyToken,ProjectController.projectAssignedToEmployee);

module.exports = router;
