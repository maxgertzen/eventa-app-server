const validateCookie = (req, res, next) => {
    const { cookies } = req

    console.log(cookies);
    if ('user' in cookies) {
        next();
    } else return res.status(403).send({ msg: 'Not Authenticated' });
}

module.exports = validateCookie;