const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const cTable = require('console.table');

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'choice',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
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
                case 'Exit':
                    connection.end();
                    break;
            }
        });
};
const viewAllEmployees = () => {
    var sql = "DROP TABLE IF EXISTS employees; CREATE TABLE employees SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ' , e.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee e on employee.manager_id = e.id;  SELECT*FROM employees"
    connection.query(sql, function (err, result) {
        console.table(result[2]);
    });
};

const viewAllEmployeesByDept = () => {
    var sql = "DROP TABLE IF EXISTS employeesByDpt; CREATE TABLE employeesByDpt SELECT * FROM employees; ALTER TABLE employeesByDpt MODIFY COLUMN department VARCHAR(30) FIRST; SELECT*FROM employeesByDpt ORDER BY department";
    connection.query(sql, function (err, result) {
        console.table(result[3]);
    });
};

const viewAllEmployeesByMng = () => {
    var sql = "DROP TABLE IF EXISTS employeesByMng; CREATE TABLE employeesByMng SELECT * FROM employees; ALTER TABLE employeesByMng MODIFY COLUMN manager VARCHAR(30) FIRST; SELECT*FROM employeesByMng ORDER BY manager DESC";
    connection.query(sql, function (err, result) {
        console.table(result[3]);
    });
};

var rolesArray = [];
const selectRole = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            rolesArray.push(res[i].title);
        }
    })
    return rolesArray;
};

var managersArray = [];
const selectManager = () => {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id = 0", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArray.push(`${res[i].first_name} ${res[i].last_name}`);
        }
    })
    return managersArray;
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name ?",
            name: 'first_name',
        },
        {
            type: 'input',
            message: "What is the employee's last name ?",
            name: 'last_name',
        },
        {
            type: 'rawlist',
            message: "What is the employee's role ?",
            name: 'roles',
            choices: selectRole(),
        },
        {
            type: 'rawlist',
            message: "Who is the employee's manager ?",
            name: 'managers',
            choices: selectManager(),

        }]).then((answers) => {
            const roleId = selectRole().indexOf(answers.roles) + 1
            const managerId = selectManager().indexOf(answers.managers) + 1
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: roleId,
                    manager_id: managerId,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`${answers.first_name} ${answers.last_name} was successfully added to the database`);
                }
            );
        });
};

connection.connect((err) => {
    if (err) throw err;
    start();
});