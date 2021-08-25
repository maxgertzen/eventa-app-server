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
                        console.log(err)
                        result(err, null);
                    });
                };
                sql.commit(function (err) {
                    if (err) {
                        return sql.rollback(function () {
                            console.log(err)
                            result(err, null);
                        });
                    }

                    console.log('created event: ', { 'event_id': res.insertId, ...newEvent });
                    result(null, { 'event_id': res.insertId, ...newEvent });
                });

            })
        } else {
            console.log('got here')
            sql.query('INSERT INTO address SET ?', newEvent.newVenue.address, (err, res) => {
                if (err) {
                    return sql.rollback(function () {
                        console.log(err)
                        result(err, null);
                    });
                };
                console.log('Created Address with id ' + res.insertId)

                newEvent.newVenue.venue.address_id = res.insertId;
                sql.query('INSERT INTO venues SET ?', newEvent.newVenue.venue, (err, res) => {
                    if (err) {
                        return sql.rollback(function () {
                            console.log(err)
                            result(err, null);
                        });
                    };
                    console.log('success insert venue ' + res.insertId)

                    newEvent.venue_id = res.insertId;
                    let { newVenue, ...finalEvent } = newEvent
                    console.log('FINAL EVENT', finalEvent)
                    sql.query('INSERT INTO events SET ?', finalEvent, (err, res) => {
                        if (err) {
                            return sql.rollback(function () {
                                console.log(err)
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
    let queryString = "SELECT e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc', ci.Name 'city', co.Name 'country' FROM events e left join venues v on e.venue_id = v.venue_id left join address a on a.address_id = v.address_id left join city ci on a.city_id = ci.id left join country co on ci.CountryCode = co.Code where event_id = ?"
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
    let complexJoin = "SELECT e.event_id, e.name, e.category_id 'category', e.description, e.price, e.dateStart, e.dateEnd, e.image 'imageupload', e.isPublic, v.venue_id 'venue_Id', v.name 'venueName', v.description 'venueDesc', e.user_id, u.first_name 'firstName', u.last_name 'lastName' ,v.address_id, a.address, ci.id 'city', ci.name 'cityName', co.name 'countryName', co.Code 'country' FROM events e left join venues v on e.venue_id = v.venue_id left join address a on v.address_id = a.address_id left join city ci on a.city_id = ci.id left join country co on co.Code = ci.CountryCode left join users u on u.user_id = e.user_id WHERE e.user_id = ? ORDER BY e.dateStart ASC"
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


Event.getAll = (uid, result) => {
    console.log(uid)
    if (uid) {
        sql.beginTransaction(function (err) {
            if (err) {
                console.log(err)
                result(err, null);
            }

            sql.query('SELECT event_id FROM guestlist WHERE user_id = ?', uid, (err, res) => {
                if (err) {
                    return sql.rollback(function () {
                        result(err, null);
                    });
                };

                let savedEvents = res;
                console.log(savedEvents)
                sql.query('SELECT e.event_id, e.name `eventName`, c.name `categoryName`, e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic FROM events e LEFT JOIN category c ON e.category_id = c.category_id  WHERE isPublic = 1 AND e.dateStart >= CURDATE() ORDER BY e.dateStart', (err, res) => {
                    if (err) {
                        console.log('error: ', err);
                        result(null, err);
                        return;
                    }


                    sql.commit(function (err) {
                        if (err) {
                            return sql.rollback(function () {
                                result(err, null);
                            });
                        }
                        console.log({ events: res, saved: savedEvents })
                        result(null, { events: res, saved: savedEvents });
                    });
                })

            });
        })
    } else {
        sql.query('SELECT e.event_id, e.name `eventName`, c.name `categoryName`, e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic FROM events e LEFT JOIN category c ON e.category_id = c.category_id  WHERE isPublic = 1', (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(null, err);
                return;
            } else {
                result(null, { events: res });

            }
        });
    }
}

Event.search = (searchTerm, result) => {
    let queryTerm = searchTerm === 'week' ? 'SELECT e.event_id, e.name `eventName`, c.name `categoryName`, e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic FROM events e LEFT JOIN category c ON e.category_id = c.category_id  WHERE isPublic = 1 AND e.dateStart >= CURDATE() ORDER BY e.dateStart LIMIT 3' : "call searchDB('" + searchTerm + "')";
    sql.query(queryTerm,
        (err, res) => {
            if (err) {
                console.error(err);
                result(null, err);
                return;
            }
            console.log(res)
            if (!res.length) {
                result({ kind: 'not_found' }, null);
                return;
            }
            result(null, res)
        })
}


Event.updateById = (eventId, updatedEvent, result) => {
    sql.beginTransaction(function (err) {
        if (err) {
            console.log(err)
            result(err, null);
        }
        if (updatedEvent.venue_id) {
            const { venueDetails, ...finalEvent } = updatedEvent;
            sql.query('UPDATE events SET ? WHERE event_id = ?', [finalEvent, eventId], (err, res) => {
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

                    if (res.affectedRows == 0) {
                        result({ kind: 'not_found' }, null);
                        return;
                    }

                    console.log('updated event: ', { 'event_id': res.insertId, ...updatedEvent });
                    result(null, { 'event_id': res.insertId, ...updatedEvent });
                });

            })
        } else {
            sql.query('INSERT INTO address SET ?', updatedEvent.venueDetails.address, (err, res) => {
                if (err) {
                    return sql.rollback(function () {
                        result(err, null);
                    });
                };

                updatedEvent.venueDetails.venue.address_id = res.insertId;
                sql.query('INSERT INTO venues SET ?', updatedEvent.venueDetails.venue, (err, res) => {
                    if (err) {
                        return sql.rollback(function () {
                            result(err, null);
                        });
                    };
                    console.log('SUCCESS UNTIL HERE')

                    updatedEvent.venue_id = res.insertId;
                    let { venueDetails, ...finalEvent } = updatedEvent
                    sql.query('UPDATE events SET ? WHERE event_id = ?', [finalEvent, eventId], (err, res) => {
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

                            if (res.affectedRows == 0) {
                                result({ kind: 'not_found' }, null);
                                return;
                            }

                            console.log('updated event: ', { 'event_id': res.insertId, ...finalEvent });
                            result(null, { 'event_id': res.insertId, ...finalEvent });
                        });
                    })
                })
            })
        }
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
};

Event.getCategories = result => {
    sql.query('SELECT * FROM category', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        result(null, res);
    });
};

Event.addToSaved = (eventId, userId, result) => {
    sql.query('INSERT INTO guestlist SET `event_id` = ?, `user_id` = ?', [eventId, userId], (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        console.log('added to saved')
        result(null, res);
    })
}

module.exports = Event