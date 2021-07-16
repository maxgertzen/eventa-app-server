const Venue = require('../models/venue.model');

exports.getCountries = (req, res) => {
    Venue.countries((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        } else { res.send(data) }
    })
};

exports.getCities = (req, res) => {
    Venue.cities(req.params.country, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            })
        } else { res.send(data) }
    })
}