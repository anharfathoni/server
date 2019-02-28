const User = require('../models/User')
const jwt = require('jsonwebtoken')

function isUserLogin(req, res, next) {
  let token = req.headers.token
  jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
    if (error) { //tidak bisa verify jwt (token yg dikirim null)
      res.status(401).send({ message: 'please login' })
    } else {
      User.findOne({
        email: decoded.email
      })
        .then(user => {
          if (user) {
            req.current_user = user
            next()
          } else {
            res.status(401).send({ message: 'please login' })
          }

        })
        .catch(error => {
          // console.log(error)
          res.status(400).send({ message: error.message })
        })
    }
  })
}

module.exports = isUserLogin