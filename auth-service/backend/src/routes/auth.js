const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/confirm', authController.confirmSignup);

router.post('/resend-code', authController.resendCode);

router.post('/login', authController.login);

router.post('/refresh', authController.refreshToken);

router.get('/profile', authController.getProfile);

module.exports = router;
