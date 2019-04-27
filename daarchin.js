const express = require('express')
require('dotenv').load()
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
var compression = require('compression')
const expressValidator = require('express-validator')

// Connect to DB
var dev_mongo = 'mongodb://127.0.0.1:27017/daarchin-test'
var DB = process.env.MONGO || dev_mongo;
mongoose.connect(DB, {useNewUrlParser: true, authSource: 'admin'})
mongoose.Promise = global.Promise;

//Config express
global.config = require('./src/config')
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json({ type : 'application/json' }))
app.use(expressValidator())
app.use(helmet())
app.use(compression())

//Routes
const appApiRouter = require('./src/routes/appApi')
const adminApiRouter = require('./src/routes/adminApi')

app.use('/api/v1/appApi' , appApiRouter)
app.use('', adminApiRouter)

app.listen(config.port , () => {
    console.log(`Server running at Port ${config.port}, stores at ${DB}`)
})
