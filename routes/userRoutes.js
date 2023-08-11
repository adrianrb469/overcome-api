const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)
router.get('/', userController.getAllUsers)
router.get('/me', userController.getCurrentUser)
router.get('/saved-events/:id', userController.getUserSavedEvents)
router.get('/:id', userController.getUserById)
router.post('/saveEvent', userController.saveEvent)
router.post('/addFriend', userController.addFriend)
// TODO:fix, this is not secure, anyone can edit anyone's info
router.post('/editInfo/:id', userController.editInfo)
router.post('/checkEvent/:id', userController.checkUserEventStatus)

router.get('/getNotifications/:id', userController.getNotifications)
router.post('/updateNotifications/:id', userController.updateNotifications)

module.exports = router
