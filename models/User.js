const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { encrypt } = require('../helpers/helper')

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name must be filled']
  },
  email: {
    type: String,
    required: [true, 'email must be filled'],
    validate: [{
      isAsync: true,
      validator: function (value, cb) {
        User.findOne({ email: value }, function (err, res) {
          cb(!res)
        })
      },
      message: `email is already registered`
    }]
  },
  password: {
    type: String,
    required: [true, 'password must be filled']
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth must be filled']
  },
  gender: {
    type: String,
    required: [true, 'Gender must be filled']
  },
  role: {
    type: String,
    default: 'User'
  },
  imageUrl: {
    type: String,
    required: [true, 'You must upload your photo profile']
  },
})

UserSchema.pre('save', function (next) {
  if (this.password) {
    this.password = encrypt(this.password)
  }
  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User