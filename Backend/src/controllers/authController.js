const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        role: req.body.role || 'student',
        status: req.body.role === 'admin' ? 'approved' : 'pending', // Admins are auto-approved for setup
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Check approval status after successful password match
    if (user.status !== 'approved' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Your account is still pending admin approval.' });
    }

    createSendToken(user, 200, res);
});
