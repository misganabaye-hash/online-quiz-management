const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('student', 'admin'));

router.get('/quizzes', studentController.getAllAvailableQuizzes);
router.get('/quizzes/:id', studentController.getQuizDetails);
router.post('/submit', studentController.submitQuiz);
router.get('/history', studentController.getStudentHistory);
router.get('/profile', studentController.getProfile);
router.patch('/profile', studentController.updateProfile);
router.patch('/change-password', studentController.changePassword);

module.exports = router;
