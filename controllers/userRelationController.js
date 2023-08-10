const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const mongoose = require('mongoose')

const getAllRequests = async (req, res) => {
    console.log('getAllRequests')
    try {
        const user = await User.findOne({ _id: req.params.id }).populate(
            'relations.user'
        )

        const requests = user?.relations.filter(
            (relation) => relation.state === 'requested'
        )

        res.json(requests)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getAllFriends = async (req, res) => {
    console.log('getAllFriends')
    try {
        const user = await User.findOne({ _id: req.params.id }).populate(
            'relations.user'
        )
        const requests = user?.relations.filter(
            (relation) => relation.state === 'accepted'
        )
        res.json(requests)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ready!
const friendRequest = async (req, res) => {
    console.log('friendRequest 2')
    try {
        // envia
        const firstUser = await User.findById(req.body.first_user_id)
        // recibe
        const secondUser = await User.findById(req.body.second_user_id)

        // check if works, user is only and id?
        const firstUserRelation = secondUser.relations.find(
            (relation) => relation.user.toString() === firstUser._id.toString()
        )

        const secondUserRelation = firstUser.relations.find(
            (relation) => relation.user.toString() === secondUser._id.toString()
        )

        if (firstUserRelation || secondUserRelation) {
            res.status(400).json({ message: 'Users are already related' })
        } else {
            // Create chat
            const chat = await Chat.create({
                messages: [],
            })

            firstUser.relations.push({
                user: secondUser._id,
                state: 'pending',
                chat_id: chat._id,
            })

            secondUser.relations.push({
                user: firstUser._id,
                state: 'requested',
                chat_id: chat._id,
            })

            await firstUser.save()
            await secondUser.save()
            await chat.save()

            res.status(201).json({
                message: 'Friend request sent successfully',
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

// route that accepts a friend request
const acceptFriendRequest = async (req, res) => {
    try {
        const accepterUser = await User.findById(req.body.accepter_user_id)
        const requesterUser = await User.findById(req.body.requester_user_id)

        const accepterRelation = accepterUser.relations.find(
            (relation) =>
                relation.user.toString() === req.body.requester_user_id
        )

        const requesterRelation = requesterUser.relations.find(
            (relation) => relation.user.toString() === req.body.accepter_user_id
        )

        if (accepterRelation && requesterRelation) {
            accepterRelation.state = 'accepted'
            requesterRelation.state = 'accepted'

            await accepterUser.save()
            await requesterUser.save()

            res.status(200).json({ message: 'Relation accepted' })
        } else {
            res.status(404).json({ message: 'Relation not found' })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const friendStatus = async (req, res) => {
    try {
        const user = await User.findById(req.body.id)
        const friend = await User.findById(req.body.friend_id)

        const userRelation = user.relations.find(
            (relation) => relation.user.toString() === friend._id.toString()
        )

        const friendRelation = friend.relations.find(
            (relation) => relation.user.toString() === user._id.toString()
        )

        if (userRelation && friendRelation) {
            if (
                userRelation.state == 'accepted' &&
                friendRelation.state == 'accepted'
            ) {
                res.status(200).json({ isFriend: true })
            } else if (
                userRelation.state == 'pending' &&
                friendRelation.state == 'requested'
            ) {
                res.status(200).json({ isFriend: 'pending' })
            } else if (
                userRelation.state == 'requested' &&
                friendRelation.state == 'pending'
            ) {
                res.status(200).json({ isFriend: 'requested' })
            }
        } else {
            res.status(200).json({ isFriend: false })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    getAllRequests,
    getAllFriends,
    friendRequest,
    acceptFriendRequest,
    friendStatus,
}
