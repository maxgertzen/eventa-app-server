const Location = require('../models/location.model');
const User = require('../models/user.model');
const Verification = require('../models/verification.model')
const sendVerificationEmail = require('../utils/sendGridEmailHelper');
// Create and Save a new user
exports.register = (req, res) => {
    if (!req.body) {
        res.status(400).json("Cannot be empty")
    };

    const user = new User(req.body)
    user.address = new Location(req.body);

    User.create(user, async (err, data) => {
        if (err) {
            res.status(500).json("Some error occurred while creating the User.");
        } else {
            try {
                await sendVerificationEmail(data.email, data.token, data.user_id, data.firstName);
                let userString = data.user_id + '?' + data.firstName;
                res.cookie('user', userString);
                res.status(200).json({ message: 'A verification email has been sent to ' + email + '.' });
            } catch (error) {
                res.status(500).json({ message: error })
            }
        }
    })
};

exports.login = (req, res) => {
    User.findByEmail(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json("User not found");
            } else {
                res.status(500).json(err);
            }
        } else {
            let userString = data.user_id + '?' + data.firstName;
            res.cookie('user', userString);
            res.status(200).json({ message: 'Logged In.' })
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
        res.status(400).json("Cannot be empty")
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