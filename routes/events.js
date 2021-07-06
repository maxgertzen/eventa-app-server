var express = require('express');
var router = express.Router();
const event = require('../controllers/event.controller');


router.route('/')
    .get(event.findAll)
    .post(event.create)

router.route('/:eventId')
    .get(event.findOne)
    .put(event.update)
    .delete(event.delete)

module.exports = router