const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')
const app = express()

app.use(express.json())

//TOPICS
app.get('/api/topics', getTopics)

module.exports = app
