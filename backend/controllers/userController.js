const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// Description: Register a user
// Route:       POST /api/user
// Access:      Public
const registerUser = asyncHandler(async(req,res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body

    if (
        !firstName ||
        !lastName ||
        !email ||
        !password
    ) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email: email })

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
    })

    if(newUser){
        res.status(201).json({
            _id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// Description: Authenticate a user
// Route:       POST /api/user/login
// Access:      Public
const loginUser = asyncHandler(async(req,res) => {
    const { 
        email, 
        password, 
    } = req.body

    const user = await User.findOne({ email: email })

    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})