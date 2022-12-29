const express = require('express')
const router = express.Router()
//資料庫
const db = require('../../models')
const Todo = db.Todo

// ======== 詳細頁 ======== //
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))

})

module.exports = router