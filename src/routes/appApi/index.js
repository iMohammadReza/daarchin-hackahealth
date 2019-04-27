const express = require('express')
const router = express.Router()

// middlewares
const apiAuth = require('./middleware/apiAuth');

// Controllers 
const { controller } = config.path.app
const AppController = require(`${controller}/AppController`)

router.post('/phone' , AppController.phone.bind(AppController))
router.post('/verify' , AppController.verify.bind(AppController))
router.post('/profile' , AppController.profile.bind(AppController))
router.post('/ask' , AppController.ask.bind(AppController))
router.post('/home', apiAuth , AppController.home.bind(AppController))
router.post('/commit' , AppController.commit.bind(AppController))

module.exports = router
