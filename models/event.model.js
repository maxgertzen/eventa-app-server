const sql = require('./db.js');

const Event = function (event) {
    this.name = event.name;
    this.description = event.description;
    this.dateStart = new Date(event.dateStart).toISOString().slice(0, 19).replace('T', ' ');
    this.dateEnd = new Date(event.dateEnd).toISOString().slice(0, 19).replace('T', ' ');
    this.image = event.image || '';
    this.isPublic = event.isPublic
}

Event.create = (newEvent, result) => {
    sql.query('INSERT INTO events SET ?', newEvent, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        console.log('created event: ', { 'event_id': res.insertId, ...newEvent });
        result(null, { 'event_id': res.insertId, ...newEvent });
    })
}

Event.findById = (eventId, result) => {
    console.log('got to model')
    let queryString = "SELECT e.name 'eventName', e.description, e.price, e.dateStart, e.dateEnd, e.image, e.isPublic, v.venue_id 'venueId', v.name 'venueName', v.description 'venueDesc' FROM events e join venues v on e.venue_id = v.venue_id WHERE event_id = ?"
    sql.query(queryString, eventId, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log(res)
            console.log(res[0])
            result(null, res[0]);
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
    sql.query('DELETE FROM events WHERE id = ?', eventId, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: 'not_found' }, null);
            return;
        }

        console.log('deleted customer with id: ', eventId);
        result(null, res);
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