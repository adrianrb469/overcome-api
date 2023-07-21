const Chat = require('../models/chatModel')
const Event = require('../models/eventModel');

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

const getLastChatsByUserId = async ( req, res ) => {
    try {
        const { userId } = req.params;

        const response = await Chat.find({ 'messages.user': userId })
            .sort({ 'messages.sent_at': -1 });

        const recentChats = response.map( chat => {
            const lastMessage = chat.messages
                .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))

            return Event.findOne({ 'chat': chat._id })
                .then( event => {
                    if ( lastMessage ) {
                        return ({
                            _id: chat._id,
                            event: event._id,
                            eventTitle: event.title,
                            messages: [
                                ...lastMessage.slice(0,3)
                            ]
                            ,
                        });
                    };
                    return null;
                })
                .catch( error => {
                    return null;
                });
        });

        Promise.all( recentChats ).then( chats => {
            res.status(200).json(chats.slice(0,3));
        }).catch( error => {
            res.status(500).send('Error fetching chats from database');
        });
        
    } catch (error) {
        res.status(500).send('Error fetching chats from database');
    };
};

module.exports = {
    getChatById,
    newMessage,
    getLastChatsByUserId,
}
