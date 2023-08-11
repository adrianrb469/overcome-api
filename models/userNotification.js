const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    show: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        required: true,
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    relatedChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    relatedEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
})

const Notification = mongoose.model('/Notification', notificationSchema)

module.exports = Notification
