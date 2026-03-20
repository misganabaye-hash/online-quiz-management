const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');

exports.getAllAvailableQuizzes = catchAsync(async (req, res, next) => {
    const quizzes = await Quiz.find().populate('course', 'title');
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

exports.submitQuiz = catchAsync(async (req, res, next) => {
    const { quizId, answers } = req.body;

    const questions = await Question.find({ quiz: quizId });
    let score = 0;

    answers.forEach((ans) => {
        const question = questions.find(q => q._id.toString() === ans.questionId);
        if (question && question.correctOption === ans.selectedOption) {
            score += question.marks;
        }
    });

    const submission = await Submission.create({
        student: req.user._id,
        quiz: quizId,
        answers,
        score,
    });

    res.status(201).json({
        status: 'success',
        data: { submission },
    });
});

exports.getStudentHistory = catchAsync(async (req, res, next) => {
    const submissions = await Submission.find({ student: req.user._id }).populate('quiz', 'title');
    res.status(200).json({
        status: 'success',
        results: submissions.length,
        data: { submissions },
    });
});

exports.getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    // Don't allow password updates through this endpoint
    if (req.body.password) {
        return res.status(400).json({ message: 'Use change password endpoint to update password' });
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
    });
});
