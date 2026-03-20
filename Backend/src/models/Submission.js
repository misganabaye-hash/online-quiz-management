const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    answers: [{
        questionId: mongoose.Schema.ObjectId,
        selectedOption: Number,
    }],
    score: {
        type: Number,
        required: true,
    },
    feedback: String,
    attemptedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
