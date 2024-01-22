const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    username: {
        type: String
    },
    lessonName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 200
    },
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment