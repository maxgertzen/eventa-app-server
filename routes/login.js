var express = require('express');
var router = express.Router();
const users = require('../controllers/user.controller');

router.route('/')
    .post(users.findOne)

module.exports = router;