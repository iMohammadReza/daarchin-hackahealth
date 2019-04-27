const express = require('express')
const router = express.Router()

// Controllers 
const { controller } = config.path.admin
const AdminController = require(`${controller}/adminController`)

router.get('/' , AdminController.get.bind(AdminController))
router.post('/' , AdminController.post.bind(AdminController))

module.exports = router
