const express = require('express')
const router = express.Router()

// Controllers 
const { controller } = config.path.app
const AppController = require(`${controller}/AppController`)



module.exports = router
