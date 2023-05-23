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
    createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
})

const User = mongoose.model('User', userSchema)

module.exports = User
