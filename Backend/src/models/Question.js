const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctOption: {
        type: Number, // Index of the correct option
        required: true,
    },
    marks: {
        type: Number,
        required: true,
        default: 1,
    },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
