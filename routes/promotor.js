var express = require('express');
var router = express.Router();
const promotorController = require('../controllers/promotorController')
const isPromotorLogin = require('../middlewares/isPromotorLogin')

router
      .post('/signin', promotorController.signIn)
      .post('/signup', promotorController.signUp)

router
      .use(isPromotorLogin)
      .get('/', promotorController.getOne)
      .put('/', promotorController.edit)
      .get('/events', promotorController.getMyEvents)

module.exports = router;
