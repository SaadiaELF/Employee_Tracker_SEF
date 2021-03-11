const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const cTable = require('console.table');

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
                    viewAllEmployees();
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
const viewAllEmployees = () => {
    var sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(sql, function (err, result) {
        console.table(result);
    });
};

connection.connect((err) => {
    if (err) throw err;
    start();
});