const sql = require('./db.js');
const location = require('./location.model')

const User = function (user) {
    this.email = user.email;
    this.password = user.password;
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.accept_mail = user.acceptMail || 0;
}

User.create = (newUser, result) => {
    let userAddress = new location(newUser);
    sql.beginTransaction(function (err) {
        if (err) { throw err; };
        sql.query('INSERT INTO address SET ?', userAddress, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };
            newUser.address_id = res.insertId;

            sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return sql.rollback(function () {
                        result(err, null);
                    })
                }


                sql.commit(function (err) {
                    if (err) {
                        return sql.rollback(function () {
                            throw err;
                        });
                    }
                    console.log('created user: ', { 'user_id': res.insertId, ...newUser });
                    result(null, { firstName: newUser.first_name, userId: res.insertId });
                });
            });
        });
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
    sql.query('SELECT first_name as `firstName`, user_id, password FROM users WHERE email = ?', userCreds.email, (err, res) => {
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
User.checkEmail = (userEmail, result) => {
    console.log('THIS IS USEREMAIL IN MODEL  ', userEmail)
    sql.query("SELECT email FROM users WHERE email = ?", userEmail, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        if (res.length) {
            result({ message: 'Email is being used' }, null);
            return
        }

        result(null, true)
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