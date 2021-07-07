var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller');
const validation = require('../middlewares/validationMiddleware');
const userAuthSchema = require('../validations/userValidation');


router.post('/login', validation(userAuthSchema), auth.login)

router.post('/register', validation(userAuthSchema), auth.register)


module.exports = router;