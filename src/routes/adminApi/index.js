const express = require('express')
const router = express.Router()

// Controllers 
const { controller } = config.path.app
const AppController = require(`${controller}/adminApi`)

router.get('/' , AppController.phone.bind(AppController))
router.post('/' , AppController.verify.bind(AppController))

module.exports = router
