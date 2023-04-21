const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const generateToken = (user) => {
    const payload = {
        _id: user._id,
        name: user.name,
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })
}

const comparePassword = async (plaintextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword)
    return isMatch
}

const login = async (req, res) => {
    try {
        email = req.body['email']
        password = req.body['password']
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const details = { _id: user._id, name: user.name, email: user.email }

        const auth_token = generateToken(user)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            auth_token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const createUser = async (req, res) => {
    try {
        const { username, name, lastname, email, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            username,
            name,
            lastname,
            email,
            password: hashedPassword,
        })
        const user = await newUser.save()
        const token = generateToken(user)
        res.json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getAllUsers = async (req, res) => {
    console.log('Getting all users...')
    try {
        const users = await userModel.find({}, { _id: 1, email: 1 })
        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching users from database')
    }
}

const getUserById = async (req, res) => {
    console.log('Getting user by id...')
    console.log(req.params)
    try {
        const user = await userModel.findOne({ _id: req.params.id })
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching user from database')
    }
}

module.exports = {
    getAllUsers,
    login,
    createUser,
    getUserById,
}
