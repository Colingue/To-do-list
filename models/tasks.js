const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    finished: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', TaskSchema)