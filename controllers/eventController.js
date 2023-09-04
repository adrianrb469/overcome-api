const Event = require('../models/eventModel')
const Chat = require('../models/chatModel')

const getAllEvents = async (req, res) => {
    try {
        const { offset = 0, limit = 15 } = req.query
        const events = await Event.find({})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .populate('participants', 'username')
            .populate('creator', 'username')
        res.status(200).json(events)
    } catch (error) {
        res.status(500).send('Error fetching events from database')
    }
}

const countEvents = async (req, res) => {
    try {
        const count = await Event.countDocuments({})
        res.status(200).json(count)
    } catch (error) {
        res.status(500).send('Error counting events from database')
    }
}

const createEvent = async (req, res) => {
    try {
        // Create the chat associated with the event
        const chat = await Chat.create({
            type: 'event',
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
            limit: req.body.limit,
        })

        // add event id to chat
        chat.event_id = event._id
        await chat.save()

        res.status(201).json(event)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error creating event')
    }
}

//get event by id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('participants', 'username')
            .populate('creator', 'username')
        res.status(200).json(event)
    } catch (error) {
        res.status(500).send('Error fetching event from database')
    }
}

const searchEvents = async (req, res) => {
    const { title, tags, startDate, endDate } = req.query

    try {
        const query = {}

        // Build the query based on the user's input
        if (title) {
            // Search by title (case-insensitive)
            query.title = { $regex: new RegExp(title, 'i') }
        }

        if (tags) {
            // Search by tags (split by comma and remove leading/trailing spaces)
            const tagsArray = tags.split(',').map((tag) => tag.trim())
            query.tags = { $in: tagsArray }
        }

        if (startDate && endDate) {
            // Search by date range
            query.date = { $gte: startDate, $lte: endDate }
        }

        // Perform the search using the built query
        const events = await Event.find(query)

        res.json(events)
    } catch (error) {
        error
        res.status(500).send('Error fetching events from the database')
    }
}

const joinEvent = async (req, res) => {
    try {
        const eventId = req.params.id // Get the event ID from the request parameters
        const userId = req.body.userId // Get the user ID from the request body

        // Find the event by ID
        const event = await Event.findById(eventId)

        // Check if the user is already a participant in the event
        if (event.participants.includes(userId)) {
            res.status(400).json({
                message: 'User is already a participant in this event',
            })
        } else {
            if (event.limit && event.participants.length >= event.limit) {
                res.status(400).json({
                    message: 'Event has reached the participant limit',
                })
            } else {
                // Add the user to the participants array and save the updated event
                event.participants.push(userId)
                const updatedEvent = await event.save()

                // Populate the participant and creator fields of the updated event
                const populatedEvent = await updatedEvent
                    .populate('participants', 'username')
                    .populate('creator', 'username')
                    .execPopulate()

                res.status(200).json(populatedEvent)
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error joining event')
    }
}

module.exports = {
    getAllEvents,
    countEvents,
    createEvent,
    getEventById,
    searchEvents,
    joinEvent,
}
