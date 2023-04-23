const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const register = require('./routes/register')
const refresh = require('./routes/refresh')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

require('dotenv').config()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/register', register)
app.use('/refresh', refresh)

mongoose
    .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => console.error(err))

mongoose.connection.once('open', () => {
    console.log('Connected to database')
    const server = app.listen(process.env.PORT, () => {
        console.log('Server is running on port', server.address().port)
    })
})
