var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth.controller');

router.route('/login')
    .get((req, res) => {
        console.log(req.body);
        res.status(200).send('cool')
    })
    .post(auth.login)



router.route('/register')
    .get((req, res) => {
        console.log(req.body);
        res.status(200).send('cool')
    })
    .post(auth.register)

module.exports = router;