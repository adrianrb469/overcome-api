const Event = require('../models/eventModel')
const Chat = require('../models/chatModel')

const getAllEvents = async (req, res) => {
    console.log(req.query)
    try {
        const { offset = 0, limit = 10 } = req.query
        console.log(offset, limit)
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
    console.log(req.body)
    tags = req.body.tags
    date_range = req.body.date_range
    try {
        // If both tag and date_range are present, filter events by both
        if (tags && date_range) {
            Event.find({
                tags: { $in: tags },
                date: {
                    $gte: date_range[0],
                    $lte: date_range[1],
                },
            })
                .then((events) => res.json(events))
                .catch((err) => res.status(500).json({ error: err.message }))
        }

        // If only tags are present, filter events by tag
        else if (tags) {
            Event.find({ tags: { $in: tags } })
                .then((events) => res.json(events))
                .catch((err) => res.status(500).json({ error: err.message }))
        }

        // If only date_range is present, filter events by date range
        else if (date_range) {
            Event.find({
                date: {
                    $gte: date_range[0],
                    $lte: date_range[1],
                },
            })
                .then((events) => res.json(events))
                .catch((err) => res.status(500).json({ error: err.message }))
        }

        // If neither tag nor date_range is present, return an error
        else {
            res.status(400).json({
                error: 'Please provide at least one search parameter',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error fetching event from database')
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    getEventById,
    searchEvents,
}
