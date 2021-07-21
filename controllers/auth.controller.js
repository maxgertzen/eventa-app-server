const Location = require('../models/location.model');
const User = require('../models/user.model');
const Verification = require('../models/verification.model')
const sendVerificationEmail = require('../utils/sendGridEmailHelper');
// Create and Save a new user
exports.register = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Cannot be empty"
        })
    };

    const user = new User(req.body)
    user.address = new Location(req.body);

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        } else {
            sendVerificationEmail(data.email, data.token);
            let userString = data.user_id + '?' + data.firstName;
            res.cookie('user', userString);
            res.status(200).send(data)
        }
    })
};

exports.login = (req, res) => {
    User.findByEmail(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json(`Either email or password is wrong.`);
            } else {
                res.status(500).json("Error retrieving user");
            }
        } else {
            let userString = data.user_id + '?' + data.firstName;
            res.cookie('user', userString);
            res.status(200).send({ msg: 'Logged In.' })
        }
    })
};

exports.check = async (req, res) => {
    User.checkEmail(req.body.email, req.body.userId, (err, data) => {
        if (err) {
            if (err.message) {
                res.status(308).send(new Error(false));
            } else {
                res.status(500).json("Error Checking DB")
            }
        } else {
            res.status(200).send(data)
        }
    })
}

exports.verification = (req, res) => {
    if (!req.body) {

    }

    Verification.verify(req.query.email, req.query.verificationToken, (err, data) => {
        if (err) {
            if (err.kind === 'verified') {
                res.status(202).json('User already verified')
            } else {
                res.status(404).json('Something went wrong')
            }
        } else {
            res.status(200).json(`${data} verified succesfully`)
        }
    })
}