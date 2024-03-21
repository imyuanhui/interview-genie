const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
