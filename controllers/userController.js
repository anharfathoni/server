const User = require('../models/User')
const Event = require('../models/Event')
const { checkPassword } = require('../helpers/helper')
const jwt = require('jsonwebtoken')

module.exports = {
  create: (req, res) => {
    console.log('masuk register user')
    let { name, email, password, gender, dob, imageUrl } = JSON.parse(req.body.data)
    let user = { name, email, password, gender, dob, imageUrl }

    if (req.file) {
      user.imageUrl = req.file.cloudStoragePublicUrl
    }

    User
      .create(user)
      .then(user => {
        res.status(200).json({ user, message: 'success register, please login to continue' })
      })
      .catch(error => {
        let message = error.message
        let errors = error.errors

        if (errors.name) {
          message = errors.name.message
        } else if (errors.email) {
          message = errors.email.message
        } else if (errors.password) {
          message = errors.password.message
        } else if (errors.dob) {
          message = errors.dob.message
        } else if (errors.gender) {
          message = errors.gender.message
        } else if (errors.imageUrl) {
          message = errors.imageUrl.message
        }

        res.status(400).json({ message })
      })
  },

  signIn: (req, res) => {
    let { email, password } = req.body

    User
      .findOne({ email })
      .then(user => {
        if (user) {
          if (checkPassword(password, user.password)) {
            let token = jwt.sign({ email, role: 'User' }, process.env.JWT_SECRET);
            res.status(200).json({ message: 'success login', token: token, userId: user._id })
          } else {
            res.status(400).json({ message: "wrong email / password" })
          }
        } else {
          res.status(400).json({ message: "wrong email / password" })
        }
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  // getAll: (req, res) => {
  //   User
  //     .find()
  //     .then(users => {
  //       res.status(200).json({ users })
  //     })
  //     .catch(error => {
  //       res.status(400).json({ message: error.message })
  //     })
  // },

  getOne: (req, res) => {
    let userId = req.current_user._id
    User
      .findById(userId)
      .then(user => {
        res.status(200).json({ user })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  edit: (req, res) => {
    let userId = req.current_user._id
    let user = JSON.parse(req.body.data)

    if (req.file) {
      user.imageUrl = req.file.cloudStoragePublicUrl
    }

    User
      .findByIdAndUpdate(userId, user, { new: true })
      .then(user => {
        res.status(200).json({ user, message: 'success edit' })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  myEvent: (req, res) => {
    let userId = req.current_user._id
    Event
      .find({ userId: { $in: [userId] } })
      .populate('userId')
      .populate('promotorId')
      .then(events => {
        res.status(200).json({ events })
      })
      // .catch(error => {
      //   res.status(400).json({ message: error.message })
      // })
  },

  joinEvent: (req, res) => {
    let userId = req.current_user._id
    let eventId = req.params.eventId
    // console.log('data', userId, '==', eventId)
    Event
      .findOne({
        $and: [
          { _id: eventId },
          { userId: { $in: [userId] } }
        ]
      })
      .then(event => {
        // console.log('eventnyaaa', event)
        if (event == null) {
          // console.log('tidak ditemukan')
          return Event.findByIdAndUpdate(eventId, { $push: { userId } })
        } else {
          // console.log('ditemukan')
          throw new Error('you already join to this event')
        }
      })
      .then(event2 => {
        res.status(200).json({ message: 'success join event' })
      })
      .catch(error => {
        // console.log('error',error.message)
        res.status(400).json({ message: error.message })
      })

  }
}