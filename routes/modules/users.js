const express = require('express')
const router = express.Router()
//資料庫
const db = require('../../models')
const User = db.User
//插件
const passport = require('passport') //登入時驗證要用 passport.authenticate
const bcrypt = require('bcryptjs')

// ======== 登入 ======== //
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// ======== 註冊 ======== //
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
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
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router