const Chat = require('../models/chatModel')
const Event = require('../models/eventModel')

const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id).populate(
            'messages.user',
            'username'
        )
        console.log('chat', chat)
        res.status(200).json(chat)
    } catch (error) {
        console.log('chat error', error)
        res.status(500).send('Error fetching chat from database')
    }
}

const newMessage = async (req, res) => {
    try {
        const { chat_id, user_id, username, message } = req.body

        const messageData = {
            user: user_id,
            message,
            sent_at: Date.now(),
        }

        let updatedChat = await Chat.findById(chat_id)

        if (!updatedChat.participants.includes(user_id)) {
            updatedChat.participants.push(user_id)
        }

        updatedChat = await updatedChat.save()

        const chatParticipants = updatedChat.participants.filter(
            (participant) => participant !== user_id
        )

        let notificationData = {
            type: 'chat_private',
            message: `${username} sent a message`,
            user_id,
        }

        if (updatedChat.type === 'event') {
            notificationData.message = `${username} sent you a message on ${updatedChat.title}`
            notificationData.event_id = updatedChat.event_id
            notificationData.type = 'chat_event'
        }

        await Promise.all(
            chatParticipants.map(async (participant) => {
                const updatedUser = await User.findByIdAndUpdate(
                    participant,
                    { $push: { notifications: notificationData } },
                    { new: true }
                )
            })
        )

        res.status(200).json(updatedChat)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error updating chat')
    }
}

const getLastChatsByUserId = async (req, res) => {
    try {
        const { userId } = req.params

        const response = await Chat.find({ 'messages.user': userId })
            .populate('messages.user', 'username')
            .sort({ 'messages.sent_at': -1 })

        const recentChats = response.map((chat) => {
            const lastMessage = chat.messages.sort(
                (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
            )

            return Event.findOne({ chat: chat._id })
                .then((event) => {
                    if (lastMessage) {
                        return {
                            _id: chat._id,
                            event: event._id,
                            eventTitle: event.title,
                            messages: [...lastMessage.slice(0, 3)],
                        }
                    }
                    return null
                })
                .catch((error) => {
                    return null
                })
        })

        Promise.all(recentChats)
            .then((chats) => {
                res.status(200).json(chats.slice(0, 3))
            })
            .catch((error) => {
                res.status(500).send('Error fetching chats from database')
            })
    } catch (error) {
        res.status(500).send('Error fetching chats from database')
    }
}

module.exports = {
    getChatById,
    newMessage,
    getLastChatsByUserId,
}
