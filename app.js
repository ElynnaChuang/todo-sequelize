const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport') //登入時驗證要用 passport.authenticate
const bcrypt = require('bcryptjs')
const usePassport = require('./config/passport')
const { authenticate } = require('./middleware/authenticate')

const app = express()
const PORT = 3000

const db = require('./models')
const User = db.User
const Todo = db.Todo

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// ======== 首頁 ======== //
app.get('/', authenticate, (req, res) => {
  return Todo.findAll({ raw: true, nest: true })
    .then((todos) => res.render('index', { todos }))
})

// ======== 詳細頁 ======== //
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))

})

// ======== 登入 ======== //
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// ======== 註冊 ======== //
app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } })
    .then(user => {
      //User已存在
      if(user) {
        console.log('User already exists!')
        return res.render('register', { name, email, password, confirmPassword })
      }
      //確認密碼不同
      if(password !== confirmPassword) {
        console.log('Confirm password is not match password!')
        return res.render('register', { name, email, password, confirmPassword })
      }

      //通過
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => {
          res.render('error', { err })
          console.log(err)
        })
    })
})

// ======== 登出 ======== //
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// ======== 監聽 ======== //
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})