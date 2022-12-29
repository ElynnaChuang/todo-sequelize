const express = require('express')
const router = express.Router()
//資料庫
const db = require('../../models')
const Todo = db.Todo

// ======== 首頁 ======== //
router.get('/', (req, res) => {
  const userId = req.user.id
  return Todo.findAll({ raw: true, nest: true, where: { UserId: userId } })
    .then((todos) => res.render('index', { todos }))
})

module.exports = router