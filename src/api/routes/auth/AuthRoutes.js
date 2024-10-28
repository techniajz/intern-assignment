const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');
const { validate } = require('../../util/validations');
const validations = require('./AuthValidations');
const { verifyToken } = require('../../util/auth');

router.post('/log-in', validate(validations.logIn), AuthController.logIn);
router.post('/log-in-web', validate(validations.logIn), AuthController.logInWeb);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/forgot-password-verify', AuthController.forgotPasswordVerify);
router.post('/reset-password', AuthController.resetPassword);
router.post('/resend-otp', AuthController.resendOtp);
router.get('/logout', verifyToken, AuthController.logOut);
router.post('/editProfile',verifyToken,AuthController.editProfile);
router.get('/testing', AuthController.testing);
router.get('/health-check', AuthController.healthCheck);
router.post('/upload_new_build',AuthController.upload_new_build);
router.get('/download_real_rstate', AuthController.download_real_rstate);

module.exports = router;
