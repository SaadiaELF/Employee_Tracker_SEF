const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
});

module.exports = connection