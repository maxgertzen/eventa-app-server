const sql = require('./db.js');
const crypto = require('crypto');

const User = function (user) {
    this.email = user.email;
    this.password = user.password;
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.accept_mail = user.acceptMail || 0;
    this.birth_date = user.birth_date;
    this.bio = user.bio
}


User.create = (newUser, result) => {
    sql.beginTransaction(function (err) {
        if (err) { throw err; };
        sql.query('INSERT INTO address SET ?', newUser.address, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };
            newUser.address_id = res.insertId;
            let { address, ...finalUser } = newUser;

            sql.query('INSERT INTO users SET ?', finalUser, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return sql.rollback(function () {
                        result(err, null);
                    })
                }
                let verObj = { user_id: res.insertId, token: crypto.randomBytes(16).toString('hex') };

                sql.query('INSERT INTO verification SET ?', verObj, (err, res) => {
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
                        console.log(res[0])
                        console.log('created user: ', { 'user_id': verObj.user_id, ...finalUser });
                        console.log(finalUser)
                        result(null, { firstName: finalUser.first_name, user_id: verObj.user_id, token: verObj.token, email: finalUser.email });
                    });
                })
            });
        });
    })
}

User.findById = (userId, result) => {
    let q = 'SELECT u.user_id, u.email,first_name, u.last_name, u.bio, u.birth_date, u.phone, u.accept_mail, a.address, ci.Name `City`, co.name `Country`, co.Region `Region` FROM users AS u LEFT JOIN address AS a on (a.address_id = u.address_id) LEFT JOIN city AS ci on (ci.id = a.city_id) LEFT JOIN country As co on (ci.CountryCode = co.Code) where u.user_id = ?';
    sql.query(q, userId, (err, res) => {
        if (err) {
            console.error(err);
            result(err, null);
            return;
        }
        console.log(res)
        if (res.length) {
            console.log(`found user: ${res[0]} `);
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
        console.log(userCreds)
        if (res.length) {
            console.log(`found user: ${res[0].firstName} `);
            if (res[0].password === userCreds.password) {
                console.log(res)
                result(null, res[0]);
                return
            } else {
                result('Email or password is incorrect', null)
                return;
            }
        }

        result({ kind: 'not_found' }, null)
    })
}
User.checkEmail = (userEmail, userId, result) => {
    sql.query("SELECT user_id, email FROM users WHERE email = ?", userEmail, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        if (userId) {
            if (res.length && parseInt(res[0].user_id) === parseInt(userId)) {
                result(null, true)
                return
            }
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
    sql.beginTransaction(function (err) {
        if (err) { throw err; };
        sql.query('INSERT INTO address SET ?', user.location, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };
            user.address_id = res.insertId;
            const { location, ...updatedUser } = user;

            sql.query('UPDATE users SET ? where user_id = ?', [updatedUser, userId], (err, res) => {
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
                    console.log('updated user: ', { 'user_id': userId, updatedUser });
                    console.log(updatedUser)
                    result(null, updatedUser);
                });
            });
        });
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