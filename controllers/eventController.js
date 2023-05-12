const Event = require('../models/eventModel')
const Chat = require('../models/chatModel')

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('participants', 'username')

        res.status(200).json(events)
    } catch (error) {
        res.status(500).send('Error fetching events from database')
    }
}

const createEvent = async (req, res) => {
    try {
        // Create the chat associated with the event
        const chat = await Chat.create({
            messages: [],
        })

        // Create the event, using the chat ID as a reference
        const event = await Event.create({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            duration: req.body.duration,
            chat: chat._id, // Use the chat ID as a reference
            hour: req.body.hour,
            tags: req.body.tags,
            link: req.body.link,
            creator: req.body.creator,
        })

        res.status(201).json(event)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error creating event')
    }
}

module.exports = {
    getAllEvents,
    createEvent,
}
