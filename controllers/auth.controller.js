const User = require('../models/user.model');

// Create and Save a new user
exports.register = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Cannot be empty"
        })
    };

    const user = new User({
        email: req.body.email,
        password: req.body.password,
    })

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        } else { res.status(200).send(data) }
    })
};

exports.login = (req, res) => {
    User.findByEmail(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with email ${req.body.email}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with email " + req.body.email
                });
            }
        } else {
            let userString = data.user_id + '?' + data.firstName;
            res.cookie('user', userString);
            res.status(200).send({ msg: 'Logged In.' })
        }
    })
};

