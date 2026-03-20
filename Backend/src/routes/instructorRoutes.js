const express = require('express');
const instructorController = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('instructor', 'admin'));

router.post('/quizzes', instructorController.createQuiz);
router.get('/quizzes', instructorController.getInstructorQuizzes);
router.get('/quizzes/:id', instructorController.getQuizDetails);
router.get('/quizzes/:id/results', instructorController.getQuizResults);
router.get('/quizzes/:id/statistics', instructorController.getQuizStatistics);
router.get('/courses', instructorController.getAssignedCourses);
router.post('/questions', instructorController.addQuestion);

module.exports = router;
