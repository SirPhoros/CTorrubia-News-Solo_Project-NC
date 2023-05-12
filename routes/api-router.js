const { getAPI } = require('../controllers/api.controller')
const articleRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const topicsRouter = require('./topics-router')
const usersRouter = require('./users-router')

const apiRouter = require('express').Router()

apiRouter.get('/', getAPI)

apiRouter.use('/articles', articleRouter)

apiRouter.use('/users', usersRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/topics', topicsRouter)

module.exports = apiRouter
