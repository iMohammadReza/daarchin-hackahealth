const express = require('express')
const router = express.Router()

// Controllers 
const { controller } = config.path.admin
const AdminController = require(`${controller}/AdminController`)
const InputController = require(`${controller}/InputController`)

router.get('/' , AdminController.get.bind(AdminController))
router.post('/' , AdminController.post.bind(AdminController))
router.put('/tip' , InputController.addTip.bind(InputController))
router.put('/action' , InputController.addAction.bind(InputController))

module.exports = router
