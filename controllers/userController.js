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
    console.log(req.params)
    try {
        const user = await User.findOne({ _id: req.params.id })
            .populate('savedEvents')
            .populate('friends')
            .populate('createdEvents')
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching user from database')
    }
}

const getCurrentUser = async (req, res) => {
    console.log(req.user)
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

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    saveEvent,
    addFriend,
}
