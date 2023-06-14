const express = require('express')
const app = express()

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

require('dotenv/config')

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Welcome to my app!')
})

// Routes set
const authRoute = require('./routes/auth')

app.use('/api/user', authRoute)

mongoose.connect(process.env.DB_CONNECTOR, () => {
    console.log('Successfully connected to the database...')
    }
)

app.listen(3000, ()=> {
    console.log('Server up and running...')
})
