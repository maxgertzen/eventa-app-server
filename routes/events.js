var express = require('express');
var router = express.Router();
const event = require('../controllers/event.controller');
// const uploadImage = require('../middlewares/uploadImageMiddleware');
const uploadImage = require('../middlewares/multerConfig');
const validateCookie = require('../middlewares/validateCookieMiddleware');

router.route('/')
    .get(event.findAll)


router.route('/s')
    .get(event.findSome)


router.route('/categories')
    .get(event.categories)

router.route('/:eventId')
    .get(event.findOne)


router.route('/dashboard')
    .get(validateCookie, event.getUserEvents)

router.route('/create')
    .post(validateCookie, uploadImage, event.create)
    .put(validateCookie, event.update)
    .delete(validateCookie, event.delete)


module.exports = router