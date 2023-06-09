const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

router.get('/', eventController.getAllEvents)
router.post('/', eventController.createEvent)
router.get('/:id', eventController.getEventById)

module.exports = router
