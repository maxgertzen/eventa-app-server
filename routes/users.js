var express = require('express');
var router = express.Router();
const users = require('../controllers/user.controller');
const validateCookie = require('../middlewares/validateCookieMiddleware');


router.route('/')
  .get(users.findAll)
  .post(users.create)

router.get('/dashboard', validateCookie, users.findOne)

router.put('/dashboard/:userId', users.update)


module.exports = router