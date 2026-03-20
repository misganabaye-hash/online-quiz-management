const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 30,
    },
    gradingRules: {
        type: String,
        default: 'Standard',
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
