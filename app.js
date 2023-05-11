const { getAPI } = require('./controllers/api.controller')
const { getArticleId, getArticle, getArticlesComment, postCommentByArticleID, patchArticle } = require('./controllers/articles.controller')
const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')
const app = express()

app.use(express.json())

//TOPICS
app.get('/api/topics', getTopics)

//API
app.get('/api', getAPI)

//ARTICLES
app.get('/api/articles/:article_id', getArticleId)
app.get('/api/articles/:article_id/comments', getArticlesComment)
app.get('/api/articles/', getArticle)


app.patch('/api/articles/:article_id', patchArticle)
//COMMENTS
app.post('/api/articles/:article_id/comments', postCommentByArticleID)

//ERROR HANDLING
////PSQL errors
app.all('*', (req, res) => {
	res.status(404).send({ msg: 'endpoint not found' })
})

//PSQL ERRORS
app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request: Not valid type of input' })
	} else if (err.code === '23503') {
		//Key (article_id)=(10000) is not present in table "articles".
		//'Key (author)=(Demiurge) is not present in table "users".
		res.status(404).send({ msg: 'One of your parameters is not found' })
	} else {
		next(err)
	}
})

////PERSONALISED ERRORS
app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg })
	} else {
		next(err)
	}
})
//////Last-Error Resource
app.use((err, req, res, next) => {
	// console.log(err)
	res.status(500).send({ msg: "server error! We're very sorry" })
})

module.exports = app
