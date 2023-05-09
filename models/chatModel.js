const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    messages: [
        {
            message: { type: String, required: true },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            sent_at: { type: Date, required: true, default: Date.now },
        },
    ],
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
