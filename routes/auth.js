var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller');
const validation = require('../middlewares/validationMiddleware');

router.route('/login')
    .all(validation)
    .post(auth.login)



router.route('/register')
    .all(validation)
    .post(auth.register)

module.exports = router;