const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', userController.getAllUsers)

router.use(authMiddleware)

router.get('/me', userController.getCurrentUser)
router.get('/:id', userController.getUserById)

module.exports = router
