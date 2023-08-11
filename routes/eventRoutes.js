const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

router.get('/search', eventController.searchEvents)
router.get('/', eventController.getAllEvents)
router.get('/count', eventController.countEvents)
router.get('/:id', eventController.getEventById)
router.post('/', eventController.createEvent)

module.exports = router
