const sql = require('./db.js');
const fs = require('fs');

const Event = function (event) {
    this.name = event.name;
    this.description = event.description;
    this.dateStart = new Date(event.dateStart).toISOString().slice(0, 19).replace('T', ' ');
    this.dateEnd = new Date(event.dateEnd).toISOString().slice(0, 19).replace('T', ' ');
    this.image = event.imageupload;
    this.isPublic = event.isPublic
    this.price = event.price
    this.category_id = event.category;
}

Event.create = (newEvent, result) => {
    console.log(newEvent)
    sql.beginTransaction(function (err) {
        if (err) {
            console.log(err)
            result(err, null);
        }
        if (newEvent.venue_id) {
            sql.query('INSERT INTO events SET ?', newEvent, (err, res) => {
                if (err) {
                    return sql.rollback(function () {
                        result(err, null);
                    });
                };
                sql.commit(function (err) {
                    if (err) {
                        return sql.rollback(function () {
                            result(err, null);
                        });
                    }

                    console.log('created event: ', { 'event_id': res.insertId, ...newEvent });
                    result(null, { 'event_id': res.insertId, ...newEvent });
                });

            })
        } else {
            sql.query('INSERT INTO address SET ?', newEvent.newVenue.address, (err, res) => {
                if (err) {
                    return sql.rollback(function () {
                        result(err, null);
                    });
                };

                newEvent.newVenue.venue.address_id = res.insertId;
                sql.query('INSERT INTO venues SET ?', newEvent.newVenue.venue, (err, res) => {
                    if (err) {
                        return sql.rollback(function () {
                            result(err, null);
                        });
                    };
                    console.log('SUCCESS UNTIL HERE')

                    newEvent.venue_id = res.insertId;
                    let { newVenue, ...finalEvent } = newEvent
                    console.log('FINAL EVENT', finalEvent)
                    sql.query('INSERT INTO events SET ?', finalEvent, (err, res) => {
                        if (err) {
                            return sql.rollback(function () {
                                result(err, null);
                            });
                        };

                        sql.commit(function (err) {
                            if (err) {
                                return sql.rollback(function () {
                                    result(err, null);
                                });
                            }

                            console.log('created event: ', { 'event_id': res.insertId, ...newEvent });
                            result(null, { 'event_id': res.insertId, ...newEvent });
                        });
                    })
                })
            })
        }
    })
}


Event.findById = (eventId, result) => {
    let queryString = "SELECT e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc' FROM events e join venues v on e.venue_id = v.venue_id WHERE event_id = ?"
    sql.query(queryString, eventId, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res[0]);
            return;
        }

        result({ kind: 'not_found' }, null)
    })
}

Event.findByUserId = (userId, result) => {
    let complexJoin = "SELECT e.event_id, e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc', e.user_id, u.first_name 'firstName', u.last_name 'lastName' ,v.address_id, a.address, ci.name 'city', co.name 'country' FROM events e left join venues v on e.venue_id = v.venue_id left join address a on v.address_id = a.address_id left join city ci on a.city_id = ci.id left join country co on co.Code = ci.CountryCode left join users u on u.user_id = e.user_id WHERE e.user_id = ? ORDER BY e.dateStart ASC"
    // let queryString = "SELECT e.event_id, e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc', e.user_id FROM events e join venues v on e.venue_id = v.venue_id WHERE e.user_id = ? ORDER BY e.dateStart ASC"
    sql.query(complexJoin, userId, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, { userEvents: res, count: res.length });
            return;
        }

        result({ kind: 'not_found' }, null)
    })
}


Event.getAll = result => {
    sql.query('SELECT * FROM events WHERE isPublic = 1', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

Event.search = (searchTerm, result) => {
    let queryTerm = "call searchDB('" + searchTerm + "')";
    sql.query(queryTerm,
        (err, res) => {
            if (err) {
                console.error(err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: 'not_found' }, null);
                return;
            }
            result(null, res[0])
        })
}

Event.updateById = (eventId, event, result) => {
    sql.query('UPDATE events SET ? WHERE id = ?',
        [event, eventId],
        (err, res) => {
            if (err) {
                console.error(err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: 'not_found' }, null);
                return;
            }

            console.log('updated event: ', { id: eventId, ...event });
            result(null, { id: eventId, ...event })
        })
}

Event.remove = (eventId, result) => {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        sql.query('SELECT image FROM events WHERE event_id = ?', eventId, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };
            if (res[0].image.startsWith('http')) {
                let filePath = res[0].image.replace('http://localhost:3100', './public');
                fs.unlink(filePath, function (err) {
                    if (err) console.log('failed to delete image')
                    else console.log('deleted image succesfully')
                })
            };
            sql.query('DELETE FROM events WHERE event_id = ?', eventId, (err, res) => {
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

                    if (res.affectedRows == 0) {
                        result({ kind: 'not_found' }, null);
                        return;
                    }
                    console.log('deleted event with id: ', eventId);
                    result(null, res);
                });
            });
        });
    });
}

Event.getCategories = result => {
    sql.query('SELECT name, category_id FROM categories', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

module.exports = Event