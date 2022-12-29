//環境
const express = require('express')
const app = express()
const PORT = 3000
//插件
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')

//檔案
const usePassport = require('./config/passport')
const routes = require('./routes/index')

//設定
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//Middleware
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

//總路由
app.use(routes)

// ======== 監聽 ======== //
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})