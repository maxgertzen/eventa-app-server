const User = require('../models/user.model');

// Create and Save a new user
exports.create = (req, res) => {
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
        } else { res.send(data) }
    })
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        } else { res.send(data) }
    })
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    if (req.params.userId) {
        User.findById(req.params.userId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with id ${req.params.userId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving user with id " + req.params.userId
                    });
                }
            } else { res.send(data) }
        })
    } else if (req.params.email) {
        User.findByEmail(req.params.email, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with email ${req.params.email}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving user with email " + req.params.email
                    });
                }
            } else { res.send(data) }
        })
    }

};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateById(
        req.params.userId,
        new Customer(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.params.userId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating User with id " + req.params.userId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {

};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.userId}.`
                })
            } else {
                res.status(500).send({
                    message: "Could not delete User with id " + req.params.customerId
                });
            }
        } else {
            res.send({ message: `User was deleted successfully!` });
        }
    })
};