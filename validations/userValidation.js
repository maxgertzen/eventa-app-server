const yup = require('yup');

const userAuthSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().max(14).required()
})

module.exports = userAuthSchema;