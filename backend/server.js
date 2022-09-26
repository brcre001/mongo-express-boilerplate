const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDb = require('./config/db')
const cors = require('cors')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

// Connect to Mongo Database
connectDB()

// Create Express Application
const app = express()

// Add dependencies to the Express Application
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Adding routes to Express Application
app.use('/api/user', require('./routes/userRoutes'))

app.use(errorHandler)