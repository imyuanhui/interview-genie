const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        default: "Pending"
    },
    title: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    keySkills: {
        type: [String],
        required: true
    },
    experience: {
        type: String,
        required: false
    },
    industry: {
        type: [String],
        required: false
    },
    company: {
        type: String,
        required: false
    },
    records: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Record'
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Feedback'
    }
},
    {
        timestamps: true
    }
);

interviewSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
});

module.exports = mongoose.model('Interview', interviewSchema);