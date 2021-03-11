const inquirer = require('inquirer');
const connection = require('./config/connection.js');

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ',
            name: 'choice',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager'],
        }]).then((answers) => {
            switch (answers.choice) {
                case 'View All Employees':
                    console.log('test')
                    break;
                case 'View All Employees By Department':
                    break;
                case 'View All Employees By Manager':
                    break;
                case 'Add Employee':
                    break;
                case 'Remove Employee':
                    break;
                case 'Update Employee Role':
                    break;
                case 'Update Employee Manager':
                    break;
            }
            connection.end();
        });
};

connection.connect((err) => {
    if (err) throw err;
    start();
});