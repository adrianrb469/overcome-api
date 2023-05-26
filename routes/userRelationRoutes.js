const express = require('express')
const router = express.Router()
const userRelationController = require('../controllers/userRelationController')

router.get('/requests', userRelationController.getAllRequests)
router.get('/friends', userRelationController.getAllFriends)
router.post('/friendRequest', userRelationController.friendRequest)
router.post('/acceptFriendRequest', userRelationController.acceptFriendRequest)
module.exports = router
