const Event = require('../models/Event')
const StaticticBefore = require('../models/StaticticBefore')
const StaticticAfter = require('../models/StatisticAfter')


module.exports = {
  create: (req, res) => {
    let { name, place, date, price, timeStart, timeEnd, latitude, longitude, description } = JSON.parse(req.body.data)
    let body = { name, place, date, price, timeStart, timeEnd, latitude, longitude, description }

    let obj = {
      ...body,
      promotorId: req.current_promotor._id,
      userId: [],
      userAttend: []
    }

    if (req.file) {
      obj.imageUrl = req.file.cloudStoragePublicUrl
    }

    Event
      .create(obj)
      .then(even => {
        res.status(201).json({ event: even, message: 'success create an event' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  getAll: (req, res) => {
    Event
      .find()
      .populate('promotorId')
      .populate('userId')
      .then(events => {
        res.status(200).json({ events: events, message: 'success get all events' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  getOne: (req, res) => {
    let { eventId } = req.params
    Event
      .findById(eventId)
      .populate('userId')
      .populate('userAttend')
      .then(even => {
        res.status(200).json({ event: even, message: 'success get an event' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  edit: (req, res) => {
    let { eventId } = req.params
    console.log(req.body.data)

    let event = JSON.parse(req.body.data)

    if (req.file) {
      event.imageUrl = req.file.cloudStoragePublicUrl
    }

    Event
      .findByIdAndUpdate(eventId, event)
      .then(even => {
        res.status(200).json({ event: even, message: 'success update event' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  emotion: (req, res) => {
    let { deviceId, emotion, imageUrl } = req.body
    Event
      .findOne({deviceId})
      .then(event => {
        if (event) {
          let camera_time = new Date()
          let converted_camera_time = Number(camera_time.getHours() + 7) + Number(camera_time.getMinutes()/60)
          if(converted_camera_time > 24) {
            converted_camera_time -= 24
          }
          let timeEnd = event.timeEnd.split(':')
          let timeEndx = Number(timeEnd[0])
          let timeEndy = Number(timeEnd[1] / 60)
          let converted_timeEnd = timeEndx + timeEndy
          if (converted_camera_time < converted_timeEnd) {
            return StaticticBefore.create({ eventId: event._id, imageUrl: imageUrl, emotion: emotion })
          } else {
            return StaticticAfter.create({ eventId: event._id, imageUrl: imageUrl, emotion: emotion })
          }
        } else {
          throw new Error({ message: 'not found' })
        }
      })
      .then(statistic => {
        res.status(200).json({ message: 'success identify user emotion' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  attendances: (req, res) => {
    let { eventId, userId } = req.params
    Event
      .findOne({
        $and: [
          { _id: eventId },
          { userAttend: { $in: [userId] } }
        ]
      })
      .then( event => {
        if (event == null) {
          return Event.findByIdAndUpdate(eventId, { $push: { userAttend: userId } })
        } else {
          throw new Error('user already attend to event')
        }
      })
      .then( event => {
        res.status(200).json({ message: `user ${userId} attended event ${eventId}` })
      })
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}