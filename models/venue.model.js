const sql = require('./db.js');
const fs = require('fs');
const location = require('./location.model')


const Venue = function (venue) {
    this.name = venue.venueName;
}

// Venue.create = (newEvent, result) => {
//     sql.query('INSERT INTO events SET ?', newEvent, (err, res) => {
//         if (err) {
//             console.error(err);
//             result(err, null);
//             return;
//         }

//         console.log('created event: ', { 'event_id': res.insertId, ...newEvent });
//         result(null, { 'event_id': res.insertId, ...newEvent });
//     })
// }

// Venue.findById = (eventId, result) => {
//     let queryString = "SELECT e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc' FROM events e join venues v on e.venue_id = v.venue_id WHERE event_id = ?"
//     sql.query(queryString, eventId, (err, res) => {
//         if (err) {
//             console.error(err);
//             result(err, null);
//             return;
//         }

//         if (res.length) {
//             result(null, res[0]);
//             return;
//         }

//         result({ kind: 'not_found' }, null)
//     })
// }

Venue.countries = result => {
    sql.query('select code as `countryCode`, name from country order by name asc', (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return
        }

        result(null, res)
    })
}

Venue.cities = (countryCody, result) => {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        sql.query('SELECT * FROM city WHERE countryCode = ? ORDER BY name', countryCody, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };

            let cities = res;

            sql.query('call getVenuesInCountry(?)', countryCody, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return sql.rollback(function () {
                        result(null, err);
                    })
                }


                sql.commit(function (err) {
                    if (err) {
                        return sql.rollback(function () {
                            throw err;
                        });
                    }

                    result(null, { cities, venues: res[0] });
                });
            });
        });
    });
}
module.exports = Venue