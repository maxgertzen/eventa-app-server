const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken
        next();
    } else {
        res.send(403).json({ msg: 'Token Error' });
    }
}

module.exports = verifyToken;