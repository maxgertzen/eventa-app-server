var express = require('express');
var router = express.Router();
const event = require('../controllers/event.controller');
// const uploadImage = require('../middlewares/uploadImageMiddleware');
const uploadImage = require('../middlewares/multerConfig');
const validateCookie = require('../middlewares/validateCookieMiddleware');

router.route('/')
    .get(event.findAll)

router.route('/dashboard')
    .get(event.getUserEvents)

router.route('/s')
    .get(event.findSome)

router.route('/:eventId')
    .get(event.findOne)
    .put(validateCookie, event.update)
    .delete(validateCookie, event.delete)

router.route('/categories')
    .get(event.categories)

router.route('/create')
    .post(validateCookie, uploadImage, event.create)


module.exports = router