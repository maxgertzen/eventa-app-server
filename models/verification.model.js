const sql = require('./db.js');

const VerificationToken = function (user) {
    this.user_id = user.user_id;
    this.token = user.token;
}
// req.query.email = email;
// req.query.token = verificationToken;
VerificationToken.verify = (email, verificationToken, result) => {
    sql.beginTransaction(function (err) {
        if (err) { throw err; };
        sql.query('SELECT user_id, email, isVerified from users where email = ?', email, (err, res) => {
            if (err) {
                return sql.rollback(function () {
                    result(null, err);
                });
            };

            if (res[0].isVerified) {
                return sql.rollback(function () {
                    result({ kind: 'verified' }, null);
                })
            }

            let userId = res[0].user_id;

            sql.query('SELECT user_id, token from verification where token = ?', verificationToken, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return sql.rollback(function () {
                        result(err, null);
                    })
                }

                if (res.length) {
                    sql.query('UPDATE users set isVerified = ? where user_id = ?', [1, userId], (err, res) => {
                        if (err) {
                            return sql.rollback(function () {
                                result(null, err);
                            });
                        };
                        sql.commit(function (err) {
                            if (err) {
                                return sql.rollback(function () {
                                    throw err;
                                });
                            }

                            if (res.affectedRows === 0) {
                                return sql.rollback(function () {
                                    result({ kind: 'verified' }, null)
                                });
                            }

                            result(null, { email });
                        })
                    })
                }
            })
        })
    })
}


module.exports = VerificationToken;