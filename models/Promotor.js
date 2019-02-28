const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { encrypt } = require('../helpers/helper')

const promotorSchema = new Schema({
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
        Promotor.findOne({ email: value }, function (err, res) {
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
  role: {
    type: String,
    default: 'Promotor'
  }
})

promotorSchema.pre('save',function(next) {
  if(this.password) {
    this.password = encrypt(this.password)
  }
  next()
})

const Promotor = mongoose.model('Promotor', promotorSchema)
module.exports = Promotor