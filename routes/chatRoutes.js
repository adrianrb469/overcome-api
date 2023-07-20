const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.get('/messages/:userId', chatController.getLastChatsByUserId);
router.get('/:id', chatController.getChatById)
router.post('/message', chatController.newMessage)

module.exports = router
