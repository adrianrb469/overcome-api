const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const register = require('./routes/register')
const refresh = require('./routes/refresh')
const eventRoutes = require('./routes/eventRoutes')
const chatRoutes = require('./routes/chatRoutes')
const userRelationRoutes = require('./routes/userRelationRoutes')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config()

app.use(
    cors({
        origin: 'http://127.0.0.1:4444',
        credentials: true,
    })
)

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:4444')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', '*')

    next()
})

app.use(express.json({ limit: '5mb' }))

app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/register', register)
app.use('/refresh', refresh)
app.use('/events', eventRoutes)
app.use('/chats', chatRoutes)
app.use('/relations', userRelationRoutes)
/*
Checking middleware
app.use((req, res, next) => {
    (req.headers.cookie)
    (req.cookies)
    next()
})
*/

mongoose
    .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => console.error(err))

console.log('Connecting to database...')
mongoose.connection.once('open', () => {
    const server = app.listen(process.env.PORT, () => {
        console.log('Server is running on port', server.address().port)
    })
})
module.exports = app
