const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, required: true, default: Date.now },
    duration: { type: Number, required: false },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    tags: [{ type: String }],
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
