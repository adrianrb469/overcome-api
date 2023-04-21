const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', userController.getAllUsers)

router.use(authMiddleware)

router.get('/:id', userController.getUserById)

module.exports = router
