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
})

const User = mongoose.model('User', userSchema)

module.exports = User
