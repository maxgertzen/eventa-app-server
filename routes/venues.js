var express = require('express');
var router = express.Router();
const venue = require('../controllers/venue.controller');
// const uploadImage = require('../middlewares/multerConfig');
// const validateCookie = require('../middlewares/validateCookieMiddleware');

router.route('/countries')
    .get(venue.getCountries)

router.route('/:country/cities')
    .get(venue.getCities)


module.exports = router