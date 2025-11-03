// Map of userId => socketId
const userSockets = {};
global._userSockets = userSockets;

const express = require('express')
const app  = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Required for Render or any proxy (so secure cookies work)
app.set("trust proxy", 1);


// env configuration
require('dotenv').config({ quiet: true})

const errorMiddleware = require('./middlewares/error')
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true               
  }))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())

require('./config/googleOAuth')

// route imports
const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRoute')


app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

//error handling middleware
app.use(errorMiddleware)

module.exports = app