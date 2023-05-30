const express = require('express')
const apiRouter = require('./routes/api-router')
const cors = require('cors');
const app = express()


app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
	res
		.status(200)
		.send({
			msg: 'All OK. The server is up and running. To have access to a list of available endpoints, access "/api',
		})
})
app.use('/api', apiRouter)

//ERROR HANDLING
////PSQL errors
app.all('*', (req, res) => {
	res.status(404).send({ msg: 'endpoint not found' })
})

//PSQL ERRORS
app.use((err, req, res, next) => {
	if (err.code === '22003') {
		res
			.status(400)
			.send({ msg: 'Bad request: ID is out of range for type integer' })
	} else {
		next(err)
	}
})

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request: Not valid type of input' })
	} else if (err.code === '23503') {
		//Key (article_id)=(10000) is not present in table "articles".
		//'Key (author)=(Demiurge) is not present in table "users".
		res
			.status(404)
			.send({ msg: 'One of your parameters does not exist in our database' })
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
