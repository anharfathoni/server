var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const isUserLogin = require('../middlewares/isUserLogin')
const {sendUploadToGCS,multer} = require('../middlewares/upload')

router
      .post('/signup', multer.single('file'), sendUploadToGCS, userController.create)
      .post('/signin', userController.signIn)

router
      .use(isUserLogin)
      .get('/', userController.getOne)
      .get('/myevent', userController.myEvent)
      .put('/', multer.single('file'), sendUploadToGCS, userController.edit)
      .put('/join/:eventId', userController.joinEvent)

module.exports = router;
