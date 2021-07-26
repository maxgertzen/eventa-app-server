var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller');
const cryptMiddleware = require('../middlewares/cryptMiddleware');
const validateCookie = require('../middlewares/validateCookieMiddleware');
const validation = require('../middlewares/validationMiddleware');
const userAuthSchema = require('../validations/userValidation');


router.post('/login', validation(userAuthSchema), cryptMiddleware, auth.login)

router.get('/logout', validateCookie, (req, res) => {
    res.clearCookie('user');
    res.status(200).redirect('../signin')
})

router.post('/email', auth.check)

router.post('/register', cryptMiddleware, auth.register)


module.exports = router;