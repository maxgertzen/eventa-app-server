const upload = require('./multerConfig')

const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            res.status(503).send({ msg: 'Something went wrong' });
            return
        } else {
            next();
        }
    })
}

module.exports = uploadImage;