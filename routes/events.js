var express = require('express');
var router = express.Router();
const event = require('../controllers/event.controller');
const validateCookie = require('../middlewares/validateCookieMiddleware');

router.route('/')
    .get(event.findAll)

router.route('/s')
    .get(event.findSome)

// route.post('/', validateCookie, event.create)

// router.route('/protected')
//     .all(validateCookie)
//     .get((req, res) => {
//         res.status(200).json({ msg: 'You are authorized' })
//     })

router.route('/show/:eventId')
    .get(event.findOne)
    .put(event.update)
    .delete(event.delete)

module.exports = router