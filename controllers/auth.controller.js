const Location = require('../models/location.model');
const User = require('../models/user.model');

// Create and Save a new user
exports.register = (req, res) => {
    if (!req.body) {
        res.status(400).send(new Error({
            message: "Cannot be empty"
        }))
    };

    const user = new User(req.body)
    user.address = new Location(req.body);

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send(new Error({
                message:
                    err.message || "Some error occurred while creating the User."
            }));
        } else {
            console.log(data)
            let userString = data.user_id + '?' + data.firstName;
            console.log(userString)
            res.cookie('user', userString);
            res.status(200).send(data)
        }
    })
};

exports.login = (req, res) => {
    User.findByEmail(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send(new Error({
                    message: `Not found user with email ${req.body.email}.`
                }));
            } else {
                res.status(500).send(new Error({
                    message: "Error retrieving user with email " + req.body.email
                }));
            }
        } else {
            let userString = data.user_id + '?' + data.firstName;
            res.cookie('user', userString);
            res.status(200).send({ msg: 'Logged In.' })
        }
    })
};

exports.check = (req, res) => {
    User.checkEmail(req.body.email, (err, data) => {
        if (err) {
            if (err.message) {
                console.log(err)
                console.log(err.message)
                res.status(308).send(new Error(false));
            } else {
                res.status(500).send({ message: "Error Checking DB" })
            }
        } else {
            res.status(200).send(data)
        }
    })
}
