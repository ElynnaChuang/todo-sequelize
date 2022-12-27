const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000

const db = require('./models')
const User = db.User
const Todo = db.Todo

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// ======== 首頁 ======== //
app.get('/', (req, res) => {
  return Todo.findAll({ raw: true, nest: true })
    .then((todos) => res.render('index', { todos }))
})

// ======== 詳細頁 ======== //
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))

})

// ======== 登入 ======== //
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

// ======== 註冊 ======== //
app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password, confirmPassword })
    .then(() => res.redirect('/'))
})

// ======== 登出 ======== //
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// ======== 監聽 ======== //
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})