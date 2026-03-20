const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const catchAsync = require('../utils/catchAsync');

exports.createQuiz = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.create({
        ...req.body,
        createdBy: req.user._id,
    });

    res.status(201).json({
        status: 'success',
        data: { quiz },
    });
});

exports.addQuestion = catchAsync(async (req, res, next) => {
    const question = await Question.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { question },
    });
});

exports.getInstructorQuizzes = catchAsync(async (req, res, next) => {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).populate('course');
    res.status(200).json({
        status: 'success',
        results: quizzes.length,
        data: { quizzes },
    });
});

exports.getQuizDetails = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id);
    const questions = await Question.find({ quiz: req.params.id });

    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({
        status: 'success',
        data: { quiz, questions },
    });
});

exports.getQuizResults = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate('course', 'title');
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    // Get all submissions for this quiz with student details
    const submissions = await Submission.find({ quiz: id })
        .populate('student', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: submissions.length,
        data: { quiz, submissions },
    });
});

exports.getQuizStatistics = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    const submissions = await Submission.find({ quiz: id });
    const totalQuestions = await Question.countDocuments({ quiz: id });

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const scores = submissions.map(s => s.score);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    res.status(200).json({
        status: 'success',
        data: {
            statistics: {
                totalSubmissions,
                totalQuestions,
                totalMarks: quiz.totalMarks,
                averageScore: Math.round(averageScore * 100) / 100,
                highestScore,
                lowestScore,
            },
        },
    });
});

exports.getAssignedCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find({ instructor: req.user._id });
    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: { courses },
    });
});
