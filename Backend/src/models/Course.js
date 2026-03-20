const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course must have a title'],
        trim: true,
    },
    description: String,
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Course must belong to an instructor'],
    },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
