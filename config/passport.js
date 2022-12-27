const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use( new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        //帳號還沒註冊
        if (!user) return done(null, false, { message: 'Email is not registered!' })
        //密碼錯誤
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if(!isMatch) return done(null, false, { message: 'Email or Password incorrect.' })
            return done(null, user)
          })
        //成功登入
      })
  }))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON() //user要先轉成 plain object
        done(null, user) //回傳給req
      })
      .catch(err => {
        res.render('error', { err })
        console.log(err)
      })
  })
}