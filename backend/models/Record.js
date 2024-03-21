const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Record', recordSchema);
