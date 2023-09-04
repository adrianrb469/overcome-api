const express = require('express')
const router = express.Router()
const recoverController = require('../controllers/recoverController')

router.post('/recover', recoverController.sendUniqueCode)
router.post('/verify', recoverController.verifyUniqueCode)
router.post('/reset', recoverController.modifyPassword)
