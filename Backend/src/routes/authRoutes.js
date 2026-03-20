const express = require('express');
const authController = require('../controllers/authController');
const recoveryController = require('../controllers/recoveryController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', recoveryController.forgotPassword);
router.patch('/resetPassword/:token', recoveryController.resetPassword);

module.exports = router;
