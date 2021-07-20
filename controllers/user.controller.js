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
        } else { res.status(200).send(data) }
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

exports.findOne = async (req, res) => {
    if (!req.body.email) {
        let id = await req.cookies.user.split('?')[0];
        User.findById(id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send(new Error({
                        message: `Not found user with id ${id}.`
                    }));
                } else {
                    res.status(500).send(new Error({
                        message: "Error retrieving user with id " + id
                    }));
                }
            } else { res.status(200).send(data) }
        })
    } else {
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

    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        bio: req.body.bio,
        birth_date: req.body.birth_date,
        location: {
            address: req.body.address,
            city_id: req.body.city
        }
    }

    User.updateById(
        req.params.userId,
        user,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.body.userId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating User with id " + req.body.userId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.userId}.`
                })
            } else {
                res.status(500).send({
                    message: "Could not delete User with id " + req.params.userId
                });
            }
        } else {
            res.send({ message: `User was deleted successfully!` });
        }
    })
};

