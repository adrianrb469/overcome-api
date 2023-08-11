const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    lastname: { type: String, required: false },
    email: { type: String, required: false },
    roles: {
        User: { type: Number, default: 1 },
        Admin: Number,
    },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
    createdEvents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Event', unique: true },
    ],
    relations: [
        // User id and state string (pending, accepted, rejected, blocked ) and chat_id
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                unique: true,
            },
            state: { type: String, default: 'pending', required: true },
            chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        },
    ],
    savedEvents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Event', unique: true },
    ],
    profilePicture: { type: String, required: false },
    notifications: [
        {
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
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            chat_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chat',
            },
            event_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event',
            },
        },
    ],
})

const User = mongoose.model('User', userSchema)

module.exports = User
