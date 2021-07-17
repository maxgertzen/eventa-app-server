var express = require('express');
var router = express.Router();
const users = require('../controllers/user.controller');
const validateCookie = require('../middlewares/validateCookieMiddleware');


router.route('/')
  .get(users.findAll)
  .post(users.create)

router.route('/dashboard')
  .get(validateCookie, users.findOne)
  .put(users.update)
  .delete(users.delete)


module.exports = router