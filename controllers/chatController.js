const Chat = require('../models/chatModel')

const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id).populate(
            'messages.user',
            'username'
        )
        console.log('chat', chat)
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).send('Error fetching chat from database')
    }
}

const newMessage = async (req, res) => {
    try {
        const chat = req.body.chat_id
        const message = {
            user: req.body.user_id,
            message: req.body.message,
            sent_at: Date.now(),
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            chat,
            { $push: { messages: message } },
            { new: true }
        )
        res.status(200).json(updatedChat)
    } catch (error) {
        res.status(500).send('Error updating chat')
    }
}

module.exports = {
    getChatById,
    newMessage,
}
