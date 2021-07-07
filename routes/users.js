var express = require('express');
var router = express.Router();
const users = require('../controllers/user.controller');


router.route('/')
  .get(users.findAll)
  .post(users.create)

router.route('/:userId')
  .get(users.findOne)
  .put(users.update)
  .delete(users.delete)


module.exports = router