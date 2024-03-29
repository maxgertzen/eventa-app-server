const validateCookie = (req, res, next) => {
    const { cookies } = req
    if ('user' in cookies) {
        next();
    } else return res.status(403).send(new Error({ msg: 'Not Authenticated' }));
}

module.exports = validateCookie;