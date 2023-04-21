const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', userController.getAllUsers)

router.post('/login', userController.login)

router.post('/register', userController.createUser)

router.use(authMiddleware)

router.get('/profile', userController.getUserById)

module.exports = router
