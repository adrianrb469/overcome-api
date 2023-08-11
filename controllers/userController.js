const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { _id: 1, email: 1, username: 1 })
        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching users from database')
    }
}

const getUserById = async (req, res) => {
    req.params
    try {
        const user = await User.findOne({ _id: req.params.id })
            .populate('savedEvents')
            .populate('createdEvents')
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching user from database')
    }
}

const getCurrentUser = async (req, res) => {
    req.user
    try {
        const user = await User.findOne({ _id: req.user._id })

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching user from database')
    }
}

const saveEvent = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.user_id })
        user.savedEvents.push(req.body.event_id)
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error saving event to user')
    }
}

const addFriend = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.user_id })
        user.friends.push(req.body.friend_id)
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error saving event to user')
    }
}

const editInfo = async (req, res) => {
    // TODO: fix, this is not secure, anyone can edit anyone's info
    /**
     * Editable fields:
     * - name
     * - lastname
     * - email
     * - password
     * - profilePicture
     */
    const { name, lastname, email, password, profilePicture } = req.body
    const userId = req.params.id

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.name = name ?? user.name
        user.lastname = lastname ?? user.lastname
        user.email = email ?? user.email
        user.password = password ?? user.password
        user.profilePicture = profilePicture ?? user.profilePicture

        await user.save()

        res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// Check if some event is saved by the user
const checkUserEventStatus = async (req, res) => {
    const user_id = req.params.id
    const eventId = req.body.event_id

    try {
        const user = await User.findById(user_id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const savedEvents = user.savedEvents.map((event) => event.toString())

        if (savedEvents.includes(eventId)) {
            res.status(200).json({ saved: true })
        } else {
            res.status(200).json({ saved: false })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const getUserSavedEvents = async (req, res) => {
    try {
        const { id } = req.params

        const events = await User.findById(id).populate('savedEvents')

        res.status(200).json(events)
    } catch (error) {
        res.status(500).send('Error fetching events from database')
    }
}

const removeSavedEvent = async ( req, res ) => {
    try {
        const { user_id, event_id } = req.body;

        const user = await User.findOne({ _id: user_id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        };

        const eventIndex = user.savedEvents.findIndex(
            (eventId) => eventId.toString() === event_id
        );

        if (eventIndex !== -1) {
            user.savedEvents.splice(eventIndex, 1);
            await user.save();

            res.status(200).json({ message: 'Event removed from saved events' });
        } else {
            res.status(404).json({ message: 'Event not found in saved events' });
        }
    } catch (error) {
        res.status(500).json({ message: err.message });
    };
};

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    saveEvent,
    addFriend,
    editInfo,
    checkUserEventStatus,
    getUserSavedEvents,
    removeSavedEvent,
}
