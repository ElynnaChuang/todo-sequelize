const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todos')
const { authenticate } = require('../middleware/authenticate')

router.use('/users', users)
router.use('/todos', authenticate, todos)
router.use('/', authenticate, home)

module.exports = router