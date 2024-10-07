//Creating MySQL connection using mysql2 node package

const mysql = require("mysql2");
require("dotenv").config();

const connection  = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

connection.connect(err => {
    if (err) {
        return console.error('Error connecting to the database:', err.stack);
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;

