const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordResetOTP: String,
    passwordResetOTPExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
