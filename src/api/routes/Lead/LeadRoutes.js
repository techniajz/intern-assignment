const express = require('express');
const router = express.Router();
const LeadController = require('./LeadController');
const { verifyToken } = require('../../util/auth');

router.get('/leadStatusList',verifyToken,LeadController.leadStatusList);
router.get('/leadSourceList',verifyToken,LeadController.leadSourceList);
router.get('/locationPreference',verifyToken,LeadController.locationPreference);
router.get('/timeline',verifyToken,LeadController.timeline);
router.get('/leadLabel',verifyToken,LeadController.leadLabel);
router.post('/createLead',verifyToken,LeadController.createLead);
router.get('/leadList',verifyToken,LeadController.leadList);
router.post('/editLead/:leadId',verifyToken,LeadController.editLead);
router.get('/projectList',verifyToken,LeadController.projectList);
router.get('/leadDetail/:leadId',verifyToken,LeadController.leadDetail);
router.post('/createQuickLead',verifyToken,LeadController.createQuickLead);
router.get('/uploadLeadFile/:leadId',verifyToken,LeadController.uploadLeadFile);
router.get('/leadFilter',verifyToken,LeadController.leadFilter);
router.delete('/deleteLead/:leadId',verifyToken,LeadController.deleteLead);
router.post('/leadStatus/:leadId',verifyToken,LeadController.leadStatus);
router.get('/remarkList',verifyToken,LeadController.remarkList);
router.post('/assignLead',verifyToken,LeadController.assignLead);
router.post('/shuffleLead',verifyToken,LeadController.shuffleLead);

router.post('/addLeadTimeline',verifyToken,LeadController.addLeadTimeline);
router.get('/leadTimelineList/:LeadId',verifyToken,LeadController.leadTimelineList);
router.get('/assignedToEmployeeList/:leadId',verifyToken,LeadController.assignedToEmployeeList);
router.get('/unAssignedEmployeeList/:leadId',verifyToken,LeadController.unAssignedEmployeeList);
router.delete('/deleteAssignedToEmployee/:assignedId',verifyToken,LeadController.deleteAssignedToEmployee);

router.get('/unAssigneLeads',verifyToken,LeadController.unAssigneLeads);
router.post('/startVisit/:leadId',verifyToken,LeadController.startVisit);
router.post('/makeCall/:leadId',verifyToken,LeadController.makeCall);
router.get('/allEmployee',verifyToken,LeadController.allEmployee);
router.post('/shareLead',verifyToken,LeadController.shareLead);
router.get('/leadShare_URL_Page',LeadController.leadShare_URL_Page);
router.post('/endVisit/:leadId',verifyToken,LeadController.endVisit);
router.get('/lead_brochure_Page',LeadController.lead_brochure_Page);
router.get('/lead_video',LeadController.lead_video);
router.get('/lead_Documents',LeadController.lead_Documents);

router.get('/lead_gallery_Page',LeadController.lead_gallery_Page);
router.get('/dropdrone',verifyToken,LeadController.dropdrone);
router.get('/dashboard',verifyToken,LeadController.dashboard);
router.get('/cronApiTest',verifyToken,LeadController.cronApiTest);
router.get('/noActionLead',verifyToken,LeadController.noActionLead);
router.post('/createExcelLead',verifyToken,LeadController.createExcelLead);
router.get('/unVisitLeadProject',verifyToken,LeadController.unVisitLeadProject);
router.get('/homePageleadList',verifyToken,LeadController.homePageleadList);
router.get('/summeryReport',verifyToken,LeadController.summeryReport);
router.get('/incentiveHistory',verifyToken,LeadController.incentiveHistory);
router.get('/export',verifyToken,LeadController.exportLead);
router.get('/getWeekHoliday', LeadController.findTodayHoliday);

// router.get('/crmIntegration',LeadController.crmIntegration);

module.exports = router;
