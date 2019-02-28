const Event = require('../models/Event')

function isEventOwner(req, res, next) {
  let eventId = req.params.eventId

  Event.findById(eventId)
    .populate('promotorId')
    .then(event => {
      if (event.promotorId.email == req.current_promotor.email) {
        next()
      } else {
        res.status(400).json({ message: 'you are not the owner of this event' })
      }
    })
    .catch(error => {
      res.status(400).json({ message: error.message })
    })
}

module.exports = isEventOwner