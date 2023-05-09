const { getAPI } = require('./controllers/api.controllers')

const express = require('express')
const app = express()

app.use(express.json())

//API
app.get('/api', getAPI)



module.exports = app
