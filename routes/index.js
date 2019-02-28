var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Promotor = require('../models/Promotor')
const jwt = require('jsonwebtoken')


router.get('/', function (req, res, next) {
  res.json({ title: 'Welcome to Event Review' });
});

router.get('/checklogin', (req, res, next) => {

  let token = req.headers.token
  jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
    if (error) { //tidak bisa verify jwt (token yg dikirim null)
      res.status(401).send({ message: 'please login' })
    } else {
      if (decoded.role == 'Promotor') {
        Promotor.findOne({
          email: decoded.email
        })
          .then(promotor => {
            if (promotor) {
              res.status(401).send({ isLogin: true, role: 'Promotor', message: 'logged in' })
              next()
            } else {
              res.status(401).send({ isLogin: false, role: 'Promotor', message: 'please login' })
            }

          })
      } else if (decoded.role == 'User') {
        User.findOne({
          email: decoded.email
        })
          .then(user => {
            if (user) {
              res.status(401).send({ isLogin: true, role: 'User', message: 'logged in' })
            } else {
              res.status(401).send({ isLogin: false, role: 'User', message: 'please login' })
            }

          })
      }
    }
  })
})

module.exports = router;
