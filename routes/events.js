const { signedCookies } = require('cookie-parser');
var express = require('express');
var router = express.Router();
const event = require('../controllers/event.controller');
// const uploadImage = require('../middlewares/uploadImageMiddleware');
const uploadImage = require('../middlewares/multerConfig');
const validateCookie = require('../middlewares/validateCookieMiddleware');

router.get('/', event.findAll)
router.get('/dashboard', event.getUserEvents)
router.get('/s', event.findSome)
router.get('/categories', event.categories)

router.get('/:eventId', event.findOne)

router.put('/:eventId', validateCookie, uploadImage, event.update)
router.delete('/:eventId', validateCookie, event.delete)


router.post('/create', validateCookie, uploadImage, event.create)
router.post('/save/:eventId', event.save)


module.exports = router