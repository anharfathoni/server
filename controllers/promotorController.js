const Promotor = require('../models/Promotor')
const Event = require('../models/Event')
const { checkPassword } = require('../helpers/helper')
const jwt = require('jsonwebtoken')

module.exports = {
  signUp: (req, res) => {
    let { name, email, password } = req.body
    let newPromotor = { name, email, password }

    Promotor
      .create(newPromotor)
      .then(promotor => {
        res.status(200).json({ promotor, message: 'success register, please login to continue' })
      })
      .catch(error => {
        let message = error.message
        let errors = error.errors

        //tag
        if (errors.name) {
          message = errors.name.message
        } else if (errors.email) {
          message = errors.email.message
        } else if (errors.password) {
          message = errors.password.message
        }

        res.status(400).json({ message })
      })
  },

  //Please Hapus Gk dipakai
  // getAll: (req, res) => {
  //   Promotor
  //     .find()
  //     .then(promotors => {
  //       res.json({ promotors })
  //     })
  //     .catch(error => {
  //       res.status(400).json({ message: error.message })
  //     })
  // },

  getOne: (req, res) => {
    let promotorId = req.current_promotor._id
    Promotor
      .findById(promotorId)
      .then(promotor => {
        res.json({ promotor })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  edit: (req, res) => {
    let promotorId = req.current_promotor._id
    let { name, email, password } = req.body
    let newPromotor = { name, email, password }

    for (let key in newPromotor) {
      if (newPromotor[key] === undefined) {
        delete newPromotor[key]
      }
    }

    Promotor
      .findByIdAndUpdate(promotorId, newPromotor, { new: true })
      .then(promotor => {
        res.status(201).json({ promotor, message: 'success edit' })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  signIn: (req, res) => {
    let { email, password } = req.body

    Promotor
      .findOne({ email })
      .then(promotor => {
        if (promotor) {
          if (checkPassword(password, promotor.password)) {
            let token = jwt.sign({ email, role: 'Promotor' }, process.env.JWT_SECRET);
            res.status(200).json({ message: 'success login', token: token, promotorId: promotor._id })
          } else {
            res.status(400).json({ message: "wrong email / password" })
          }
        } else {
          res.status(400).json({ message: "wrong email / password" })
        }
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  getMyEvents: (req, res) => {
    let promotorId = req.current_promotor._id

    Event
      .find({ promotorId: promotorId })
      .then(events => {
        res.status(200).json({ events, message: 'success get my events' })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  }
}