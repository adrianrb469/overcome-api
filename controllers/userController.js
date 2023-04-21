const User = require('../models/userModel')

getAllUsers = async (req, res) => {
    console.log('Getting all users...')
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching users from database')
    }
}

module.exports = {
    getAllUsers,
}
