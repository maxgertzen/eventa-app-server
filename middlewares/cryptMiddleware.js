const crypto = require('crypto');

const cryptMiddleware = (req, res, next) => {
    const { password } = req.body;
    req.body.password = crypto.createHmac('sha256', process.env.SECRET)
        .update(password)
        .digest('base64')
    next()
}

module.exports = cryptMiddleware;