const inquirer = require('inquirer');
const connection = require('./config/connection.js');


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
});