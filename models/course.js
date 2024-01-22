const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean
    },
    addedBy: {
        
    }
}, { timestamps: true })

const Course = mongoose.model('Course', courseSchema)

module.exports = Course