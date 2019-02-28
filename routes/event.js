var express = require('express');
var router = express.Router();
const eventController = require('../controllers/eventController')
const isPromotorLogin = require('../middlewares/isPromotorLogin')
const isEventOwner = require('../middlewares/isEventOwner')
const {sendUploadToGCS,multer} = require('../middlewares/upload')

router
      .get('/', eventController.getAll)
      .get('/attend/:userId/:eventId', eventController.attendances)
      .get('/:eventId', eventController.getOne)
      .post('/emotion', eventController.emotion)

router
      .use(isPromotorLogin)
      .post('/',  multer.single('file'), sendUploadToGCS, eventController.create)
      .patch('/:eventId',  isEventOwner,  multer.single('file'), sendUploadToGCS, eventController.edit)

module.exports = router;
