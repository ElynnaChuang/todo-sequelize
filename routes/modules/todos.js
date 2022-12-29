const express = require('express')
const router = express.Router()
//資料庫
const db = require('../../models')
const Todo = db.Todo

// ======== C 新增todo ======== //
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name } = req.body
  const UserId = req.user.id
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch((err) => {
      console.log(err)
      res.render('error', { err })
    })
})

// ======== R詳細頁 ======== //
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch((err) => {
      console.log(err)
      res.render('error', { err })
    })
})

module.exports = router