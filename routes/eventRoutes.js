const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

router.get('/search', eventController.searchEvents)
router.get('/', eventController.getAllEvents)
router.get('/:id', eventController.getEventById)
router.post('/', eventController.createEvent)
router.post('/joinEvent', eventController.joinEvent)

module.exports = router
