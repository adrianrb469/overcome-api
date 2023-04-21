const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/users')
app.use(express.json())
app.use('/users', userRoutes)

mongoose
    .connect(
        'mongodb+srv://admin:dKsotpZOHYzFLtWl@overcome.915kam0.mongodb.net/Overcome?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err))

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

app.get('/', (req, res) => {
    res.send('Hello World')
})
