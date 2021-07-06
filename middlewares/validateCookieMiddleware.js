const validateCookie = (req, res, next) => {
    const { cookies } = req

    if ('session_id' in cookies) {
        console.log('Session ID exists');
        if (cookies.session_id === req.sessionId) next();
        else return res.status(403).send({ msg: 'Not Authenticated' });
    }
}

module.exports = validateCookie;