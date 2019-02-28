var express = require('express');
var router = express.Router();
const beforeEventController = require('../controllers/beforeEventController')

router
      .get('/:eventId', beforeEventController.getAll)
      // .post('/', beforeEventController.create)

module.exports = router;
