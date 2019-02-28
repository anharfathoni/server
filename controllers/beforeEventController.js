const BeforeEvent = require('../models/StaticticBefore')

module.exports = {
  // create: (req,res) => {
  //   let obj = {
  //     eventId: req.body.eventId,
  //     image: req.body.image, //nanti diganti,
  //     emotion: req.body.emotion
  //   }

  //   BeforeEvent
  //     .create(obj)
  //     .then(even => {
  //       res.status(201).json({event: even, message: 'success create an before event stats'})
  //     })
  //     .catch(error => {
  //       res.status(400).json({ message: error.message })
  //     })
  // },

  getAll: (req,res)=> {
    let { eventId } = req.params
    BeforeEvent
      .find({eventId})
      .populate({path : 'eventId', populate : {path : 'userAttend'}})
      .then(events => {
        res.status(200).json({stats: events, message: 'success get all before event stats'})
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  }
}