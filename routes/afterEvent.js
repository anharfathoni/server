var express = require('express');
var router = express.Router();
const afterEventController = require('../controllers/afterEventController')

router
      .get('/:eventId', afterEventController.getAll)
      // .post('/', afterEventController.create)

module.exports = router;
