const Event = require('../models/event.model');
const Location = require('../models/location.model');
const Venue = require('../models/venue.model');
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send(new Error({
            message: "Cannot be empty"
        }))
    };

    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        category: parseInt(req.body.category),
        imageupload: req.file ? `http://localhost:3100/${req.file.path.replace("public\\", "")}` : '/image-placeholder.png',
        isPublic: req.body.isPublic ? 1 : 0
    })

    req.body.venueId ? event.venue_id = req.body.venueId : event.newVenue = { address: new Location(req.body), venue: new Venue(req.body) };

    event.user_id = req.cookies.user.split('?')[0]

    Event.create(event, (err, data) => {
        if (err) {
            res.status(500).send(new Error({
                message:
                    err || "Some error occurred while creating the User."
            }));
        } else {
            res.status(200).send({
                message: `${data.name} is added successfully!`
            })
        }
    })
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send(new Error({
            message: "Content can not be empty!"
        }));
    }

    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        category: parseInt(req.body.category),
        imageupload: req.file ? `http://localhost:3100/${req.file.path.replace("public\\", "")}` : null,
        isPublic: req.body.isPublic ? 1 : 0
    })
    console.log(event)

    if (req.body.venueId) {
        event.venue_id = req.body.venueId
    }
    event.venueDetails = { address: new Location(req.body), venue: new Venue(req.body) };

    event.user_id = req.cookies.user.split('?')[0]

    if (!event.image) {
        delete event.image;
    }
    console.log(event)
    Event.updateById(
        req.params.eventId,
        event,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send(new Error({
                        message: `Not found Event with id ${req.params.eventId}.`
                    }));
                } else {
                    res.status(500).send(new Error({
                        message: "Error updating Event with id " + req.params.eventId
                    }));
                }
            } else res.send(data);
        }
    );
};

exports.findAll = (req, res) => {
    let uid;
    if (req.cookies.user) {
        uid = req.cookies.user.split('?')[0]
    }
    Event.getAll(uid, (err, data) => {
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
            res.status(500).send(new Error({
                message:
                    /* err.message ||  */"Some error occurred while retrieving categories."
            }))
        } else { res.send(data) }
    })
}

exports.save = (req, res) => {
    let { cookies } = req;
    let uid;
    if ("user" in cookies) {
        uid = cookies.user.split('?')[0];
    } else {
        uid = req.body.userId
    }
    Event.addToSaved(req.params.eventId, uid, (err, data) => {
        if (err) {
            res.status(500).send(new Error({
                message: "Error saving event"
            }))
        } else {
            res.send(data)
        }
    })
}