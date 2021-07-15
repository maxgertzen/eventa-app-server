const Event = require('../models/event.model');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Cannot be empty"
        })
    };

    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        imageupload: req.file.filename || '',
        isPublic: req.body.isPublic
    })

    let userId = req.cookies.user.split('?')[0];

    event.user_id = userId

    Event.create(event, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        } else {
            res.status(200).send({
                message: `${data.name} is added successfully!`
            })
        }
    })
};

exports.findAll = (req, res) => {
    Event.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        } else { res.send(data) }
    })
};
exports.findSome = async (req, res) => {
    Event.search(req.query.search, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        } else { res.send(data) }
    })
};


exports.findOne = async (req, res) => {
    Event.findById(req.params.eventId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found event with id ${req.params.eventId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving event with id " + req.params.eventId
                });
            }
        } else { res.status(200).send(data) }
    })
};

exports.getUserEvents = (req, res) => {
    let { cookies } = req;
    let uid = cookies.user.split('?')[0];
    Event.findByUserId(uid, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(202).send({
                    message: 'No events for current user'
                })
            } else {
                res.status(500).send({
                    message: 'Error retrieving user events'
                })
            }
        } else {
            res.status(200).send(data)
        }
    })
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Event.updateById(
        req.params.eventId,
        new Event(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Event with id ${req.params.eventId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Event with id " + req.params.eventId
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    Event.remove(req.params.eventId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Event with id ${req.params.eventId}.`
                })
            } else {
                res.status(500).send({
                    message: "Could not delete Event with id " + req.params.eventId
                });
            }
        } else {
            res.send({ message: `Event was deleted successfully!` });
        }
    })
};

exports.categories = (req, res) => {
    Event.getCategories((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            })
        } else { res.send(data) }
    })
}