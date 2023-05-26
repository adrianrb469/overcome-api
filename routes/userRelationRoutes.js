const express = require('express')
const router = express.Router()
const userRelationController = require('../controllers/userRelationController')

router.get('/', userRelationController.getAllUserRelations)
router.post('/friendRequest', userRelationController.friendRequest)
router.put('/:id', userRelationController.updateUserRelation)
router.post('/acceptFriendRequest', userRelationController.acceptFriendRequest)
module.exports = router
