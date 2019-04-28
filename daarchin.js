const express = require('express')
require('dotenv').load()
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
var compression = require('compression')
const expressValidator = require('express-validator')
const pug = require('pug');
const path = require('path');
var cron = require('node-cron');
var utils = require('./src/utils')

// Connect to DB
var dev_mongo = 'mongodb://127.0.0.1:27017/daarchin-test'
var DB = process.env.MONGO || dev_mongo;
mongoose.connect(DB, {useNewUrlParser: true, authSource: 'admin'})
mongoose.Promise = global.Promise;

// Set views path
app.set('public', path.join(__dirname, 'src/view'));
// Set public path
app.use(express.static(path.join(__dirname, 'src/view')));
// Set pug as view engine
app.set('view engine', 'pug');

//Config express
global.config = require('./src/config')
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json({ type : 'application/json' }))
app.use(expressValidator())
app.use(helmet())
app.use(compression())
const User = require(`${config.path.model}/User`)

//Reminders cron jobs
var task = cron.schedule('3 22 * * *', () => {
    let dd = new Date
    User.find({}, async(err, users)=>{
        if(users){
            for(let usr of users){
                if(utils.is_the_date(usr.periodDay, 1)){
                    utils.sendSMS("Reminder for SME test", usr.phone)
                }
                if(utils.date_diff_indays(usr.createdAt, dd)==365){
                    utils.sendSMS("Reminder for mamography", usr.phone)
                    utils.sendSMS("Reminder for your partner mamography", usr.phone2)
                }
            }
        }
    })
});
task.start()

//Routes
const appApiRouter = require('./src/routes/appApi')
const adminApiRouter = require('./src/routes/adminApi')

app.use('/api/v1/appApi' , appApiRouter)
app.use('', adminApiRouter)

app.listen(config.port , () => {
    console.log(`Server running at Port ${config.port}, stores at ${DB}`)
})
