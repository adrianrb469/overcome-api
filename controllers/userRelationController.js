const User = require('../models/userModel')
const UserRelation = require('../models/userRelationModel')
const Chat = require('../models/chatModel')
const mongoose = require('mongoose')

const getAllUserRelations = async (req, res) => {
    try {
        const userRelations = await UserRelation.find()
        res.json(userRelations)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const friendRequest = async (req, res) => {
    try {
        // Create a user relation, with the first user being the one who sent the request
        // and the second user being the one who received the request
        // set the first user agreement to true
        // set the second user agreement to false
        // create a new chat and set the newly created id to the chat_id field
        // of the user relation
        console.log('FRIEND REQUEST')
        console.log(req.body.first_user_id)
        console.log(req.body.second_user_id)
        const userRelation = new UserRelation({
            user1: req.body.first_user_id,
            user2: req.body.second_user_id,
            first_user_agreement: true,
            second_user_agreement: false,
        })
        console.log('here1')
        const newChat = new Chat({
            _id: new mongoose.Types.ObjectId(),
            messages: [],
        })
        console.log('here2')
        userRelation.chat_id = newChat._id
        console.log('here3')
        await userRelation.save()
        await newChat.save()

        console.log('here4')
        res.status(201).json(userRelation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const updateUserRelation = async (req, res) => {
    try {
        const userRelation = await UserRelation.findById(req.params.id)
        if (req.body.first_user_agreement != null) {
            userRelation.first_user_agreement = req.body.first_user_agreement
        }
        if (req.body.second_user_agreement != null) {
            userRelation.second_user_agreement = req.body.second_user_agreement
        }
        await userRelation.save()
        res.json(userRelation)
    } catch (err) {}
}

// route that accepts a friend request
const acceptFriendRequest = async (req, res) => {
    try {
        const userRelation = await UserRelation.findOne({
            first_user_id: req.body.requester_user_id,
            second_user_id: req.body.accepter_user_id,
        })
        userRelation.second_user_agreement = true
        await userRelation.save()
        res.json(userRelation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    getAllUserRelations,
    friendRequest,
    updateUserRelation,
    acceptFriendRequest,
}
