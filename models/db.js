const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: 'utc'
})

connection.connect(error => {
    if (error) throw error;
    console.log("Connection to DB established")
})

module.exports = connection;