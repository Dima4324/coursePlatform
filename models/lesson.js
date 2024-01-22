const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lesssonSchema = new Schema({
    course_name: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Lesson = mongoose.model('Lesson', lesssonSchema)

module.exports = Lesson