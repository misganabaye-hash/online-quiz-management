const User = require('../models/User');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');

exports.getPendingUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({ status: 'pending' });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users },
    });
});

exports.updateUserStatus = catchAsync(async (req, res, next) => {
    const { userId, status } = req.body;
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ status: 'success', data: { users } });
});

// Course Management
exports.createCourse = catchAsync(async (req, res, next) => {
    const course = await Course.create(req.body);
    res.status(201).json({ status: 'success', data: { course } });
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find().populate('instructor', 'name');
    res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});

exports.getSystemStatistics = catchAsync(async (req, res, next) => {
    const Quiz = require('../models/Quiz');
    const Submission = require('../models/Submission');

    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    // User breakdown by role
    const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // User breakdown by status
    const usersByStatus = await User.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent users (last 5)
    const recentUsers = await User.find()
        .select('name email role status createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        status: 'success',
        data: {
            statistics: {
                totalUsers,
                totalCourses,
                totalQuizzes,
                totalSubmissions,
                usersByRole,
                usersByStatus,
                recentUsers,
            },
        },
    });
});
