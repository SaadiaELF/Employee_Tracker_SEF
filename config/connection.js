// requiring mysql npm 
const mysql = require('mysql');
// requiring dotenv npm 
require('dotenv').config();

// Creating the connection to the database
const connection = mysql.createConnection({
    multipleStatements: true,
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
});

module.exports = connection