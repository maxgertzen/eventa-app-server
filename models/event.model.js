const sql = require('./db.js');

const Event = function (event) {
    this.name = event.name;
    this.description = event.description;
    this.price$ = event.price$ || 0;
    this.dateStart = event.dateStart;
    this.dateEnd = event.dateEnd;
    this.timeStart = event.timeStart;
    this.timeEnd = event.timeEnd || '';
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

        console.log('created event: ', { 'event': res.insertId, ...newEvent });
        result(null, { 'event_id': res.insertId, ...newEvent });
    })
}

Event.findById = (eventId, result) => {
    sql.query('SELECT * FROM events WHERE ? ', eventId, (err, res) => {
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


Event.getAll = result => {
    sql.query('SELECT * FROM events WHERE isPublic = 1', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        console.table('events: ', res);
        result(null, res);
    });
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

module.exports = Event