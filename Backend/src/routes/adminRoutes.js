const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/pending-users', adminController.getPendingUsers);
router.patch('/update-user-status', adminController.updateUserStatus);
router.get('/users', adminController.getAllUsers);

router.post('/courses', adminController.createCourse);
router.get('/courses', adminController.getAllCourses);
router.get('/statistics', adminController.getSystemStatistics);

module.exports = router;
