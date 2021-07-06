const sql = require('./db.js');

const User = function (user) {
    this.email = user.email;
    this.password = user.password;
}

User.create = (newUser, result) => {
    sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        console.log('created user: ', { 'user_id': res.insertId, ...newUser });
        result(null, { 'user_id': res.insertId, ...newUser });
    })
}

User.findById = (userId, result) => {
    sql.query('SELECT * FROM users WHERE ? ', userId, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log('found user: ${res[0]}');
            result(null, res[0]);
            return;
        }

        result({ kind: 'not_found' }, null)
    })
}

User.findByEmail = (userCreds, result) => {
    sql.query('SELECT * FROM users WHERE email = ?', userCreds.email, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log(`found user: ${res[0]}`);
            if (res[0].password === userCreds.password) {
                console.log(res)
                result(null, res[0]);
                return
            } else {
                result('WRONG!', null)
                return;
            }
        }

        result({ kind: 'not_found' }, null)
    })
}

User.getAll = result => {
    sql.query('SELECT * FROM users', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        console.table('users: ', res);
        result(null, res);
    });
}

User.updateById = (userId, user, result) => {
    sql.query('UPDATE users SET email = ?, first_name = ? WHERE id = ?',
        [user.email, user['first_name'], userId],
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

            console.log('updated user: ', { id: userId, ...user });
            result(null, { id: userId, ...user })
        })
}

User.remove = (userId, result) => {
    sql.query('DELETE FROM users WHERE id = ?', userId, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Customer with the userId
            result({ kind: 'not_found' }, null);
            return;
        }

        console.log('deleted customer with id: ', userId);
        result(null, res);
    });
}

module.exports = User