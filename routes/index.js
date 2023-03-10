const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const auth = require('./modules/auth')
const todos = require('./modules/todos')
const { authenticate } = require('../middleware/authenticate')

router.use('/users', users)
router.use('/auth', auth)
router.use('/todos', authenticate, todos)
router.use('/', authenticate, home)

module.exports = router