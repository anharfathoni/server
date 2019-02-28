const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema({
  name: String,
  place: String,
  date: Date,
  description: String,
  timeStart: String,
  timeEnd: String,
  userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
  userAttend: [{type: Schema.Types.ObjectId, ref: 'User'}],
  price: Number,
  promotorId: {type: Schema.Types.ObjectId, ref: 'Promotor'},
  status: {type: String, default: "Available"},
  imageUrl: String,
  deviceId: String,
  latitude: String,
  longitude: String
})

const Event = mongoose.model('Event', EventSchema)
module.exports = Event