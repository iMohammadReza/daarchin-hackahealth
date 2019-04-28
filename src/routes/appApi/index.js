const express = require('express')
const router = express.Router()

// middlewares
const apiAuth = require('./middleware/apiAuth');

// Controllers 
const { controller } = config.path.app
const AppController = require(`${controller}/AppController`)

router.post('/phone' , AppController.phone.bind(AppController))
router.post('/verify' , AppController.verify.bind(AppController))
router.post('/profile', apiAuth , AppController.profile.bind(AppController))
router.post('/ask' , apiAuth , AppController.ask.bind(AppController))
router.post('/home', apiAuth , AppController.home.bind(AppController))
router.post('/commit' , apiAuth , AppController.commit.bind(AppController))
router.put('/game' , apiAuth , AppController.game.bind(AppController))

module.exports = router
