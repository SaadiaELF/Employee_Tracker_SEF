const inquirer = require('inquirer');
const connection = require('./config/connection.js');
const cTable = require('console.table');

const mainMenu = () => {
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
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    UpdateEmployeeRole();
                    break;
                case 'Update Employee Manager':
                    UpdateEmployeeManager();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
};
const viewAllEmployees = () => {
    var sql = "DROP TABLE IF EXISTS employees; CREATE TABLE employees SELECT employee.id, CONCAT(employee.first_name, ' ' ,employee.last_name) AS name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ' , e.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee e on employee.manager_id = e.id;  SELECT*FROM employees ORDER BY id"
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('\n');
        console.table(result[2]);
        mainMenu();
    });
   };

const viewAllEmployeesByDept = () => {
    var sql = "DROP TABLE IF EXISTS employeesByDpt; CREATE TABLE employeesByDpt SELECT * FROM employees; ALTER TABLE employeesByDpt MODIFY COLUMN department VARCHAR(30) FIRST; SELECT*FROM employeesByDpt ORDER BY department";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('\n');
        console.table(result[3]);
        mainMenu();
    });
};

const viewAllEmployeesByMng = () => {
    var sql = "DROP TABLE IF EXISTS employeesByMng; CREATE TABLE employeesByMng SELECT * FROM employees; ALTER TABLE employeesByMng MODIFY COLUMN manager VARCHAR(30) FIRST; SELECT*FROM employeesByMng ORDER BY manager DESC";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('\n');
        console.table(result[3]);
        mainMenu();
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
    let employeesArray = [];
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }
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
                type: 'list',
                message: "What is the employee's role ?",
                name: 'roles',
                choices: selectRole(),
            },
            {
                type: 'list',
                message: "Who is the employee's manager ?",
                name: 'managers',
                choices: selectManager(),

            }]).then((answers) => {
                const roleId = selectRole().indexOf(answers.roles) + 1;
                const managerId = employeesArray.indexOf(answers.managers) + 1;
                connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: roleId,
                        manager_id: managerId,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`\n ${answers.first_name} ${answers.last_name} was successfully added to the database`);
                    }
                );
                mainMenu();
            });
    });
};

const removeEmployee = () => {
    let employeesArray = [];
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }

        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: "What is the employee's role ?",
                choices: employeesArray,

            }]).then((answers) => {
                const employeeId = employeesArray.indexOf(answers.employeeName) + 1;
                connection.query('DELETE FROM employee WHERE ?',
                    {
                        id: employeeId,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`\n ${answers.employeeName} was successfully deleted from the database`);
                    }
                );
                mainMenu();
            });

    });
};

const UpdateEmployeeRole = () => {
    let employeesArray = [];
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update ?",
                name: 'employeeName',
                choices: employeesArray,

            },
            {
                type: 'list',
                message: "Please select the new role :",
                name: 'employeeRole',
                choices: selectRole(),

            }]).then((answers) => {
                const employeeId = employeesArray.indexOf(answers.employeeName) + 1;
                const roleId = selectRole().indexOf(answers.employeeRole) + 1;
                connection.query('UPDATE employee SET ? WHERE ?',
                    [
                        {
                            role_id: roleId,
                        },
                        {
                            id: employeeId,
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log(`\n ${answers.employeeName} was successfully updated!`);
                    }
                );
                mainMenu();
            });
    });
};

const UpdateEmployeeManager = () => {
    let employeesArray = [];
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's manager do you want to update ?",
                name: 'employeeName',
                choices: employeesArray,

            },
            {
                type: 'list',
                message: "Which employee do you want to set as manager for the selected employee ?",
                name: 'employeeManager',
                choices: selectManager(),

            }]).then((answers) => {
                const employeeId = employeesArray.indexOf(answers.employeeName) + 1;
                const managerId = employeesArray.indexOf(answers.employeeManager) + 1;
                connection.query('UPDATE employee SET ? WHERE ?',
                    [
                        {
                            manager_id: managerId,
                        },
                        {
                            id: employeeId,
                        },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log(`\n ${answers.employeeName} was successfully updated!`);
                    }
                );
                mainMenu();
            });
    });
};


connection.connect((err) => {
    if (err) throw err;
    mainMenu();
});