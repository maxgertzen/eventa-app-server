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
        price$: req.body.price,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        image: req.body.image || '',
        isPublic: req.body.isPublic
    })

    Event.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        } else { res.status(200).send(data) }
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


exports.findOne = (req, res) => {
    if (req.params.eventId) {
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
            } else { res.send(data) }
        })
    }
};

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