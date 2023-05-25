const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)
router.get('/', userController.getAllUsers)
router.get('/me', userController.getCurrentUser)
router.get('/:id', userController.getUserById)
router.post('/saveEvent', userController.saveEvent)

module.exports = router
