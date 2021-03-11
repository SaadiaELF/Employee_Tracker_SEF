const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const cTable = require('console.table');

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'choice',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager'],
        }]).then((answers) => {
            switch (answers.choice) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewAllEmployeesByDept();
                    break;
                case 'View All Employees By Manager':
                    viewAllEmployeesByMng();
                    break;
                case 'Add Employee':
                    addEmployee();
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
    var sql = "SELECT*FROM employees";
    connection.query(sql, function (err, result) {
        console.table(result);
    });
};

const viewAllEmployeesByDept = () => {
    var sql1 = "ALTER TABLE employeesByDpt MODIFY COLUMN department VARCHAR(30) FIRST";
    connection.query(sql1, function (err, result) {
    });
    var sql2 = "SELECT*FROM employeesByDpt ORDER BY department";
    connection.query(sql2, function (err, result) {
        console.table(result);
    });
};

const viewAllEmployeesByMng = () => {
    var sql1 = "ALTER TABLE employeesByMng MODIFY COLUMN manager VARCHAR(30) FIRST";
    connection.query(sql1, function (err, result) {
    });
    var sql2 = "SELECT*FROM employeesByMng ORDER BY manager DESC";
    connection.query(sql2, function (err, result) {
        console.table(result);
    });
};

let rolesArray = [];
const selectRole = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            rolesArray.push(res[i].title);
        }

    })
    return rolesArray;
};

let managersArray = [];
const selectManager = () => {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArray.push(res[i].last_name);
        }

    })
    return managersArray;
};
connection.connect((err) => {
    if (err) throw err;
    start();
});