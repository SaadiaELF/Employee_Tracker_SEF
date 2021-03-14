// requiring inquirer package
const inquirer = require('inquirer');
// link to connection.js file
const connection = require('./config/connection.js');
// requiring console.table npm
const cTable = require('console.table');

// Main menu prompt function 
const mainMenu = () => {

    // Prompt user to choose an option
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do ?',
            name: 'choice',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],

        }]).then((answers) => {

            // Switch case depending on the user choice
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

// View all employees table
const viewAllEmployees = () => {

    // Query to view all employees by creating a new table joining existing tables in the schema
    var sql = "DROP TABLE IF EXISTS employees; CREATE TABLE employees SELECT employee.id, CONCAT(employee.first_name, ' ' ,employee.last_name) AS name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ' , e.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee e on employee.manager_id = e.id;  SELECT*FROM employees ORDER BY id"

    // Query from connection
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('\n');

        // Display query results using console.table
        console.table(result[2]);

        // Back to main menu
        mainMenu();
    });
};

// View all employees by department table
const viewAllEmployeesByDept = () => {

    // Query to view all employees  by department creating a new table from employees table
    var sql = "DROP TABLE IF EXISTS employeesByDpt; CREATE TABLE employeesByDpt SELECT * FROM employees; ALTER TABLE employeesByDpt MODIFY COLUMN department VARCHAR(30) FIRST; SELECT*FROM employeesByDpt ORDER BY department";

    // Query from connection
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('\n');

        // Display query results using console.table
        console.table(result[3]);

        // Back to main menu
        mainMenu();
    });
};

// View all employees by Manager table
const viewAllEmployeesByMng = () => {

    // Query to view all employees by manager creating a new table from employees table
    var sql = "DROP TABLE IF EXISTS employeesByMng; CREATE TABLE employeesByMng SELECT * FROM employees; ALTER TABLE employeesByMng MODIFY COLUMN manager VARCHAR(30) FIRST; SELECT*FROM employeesByMng ORDER BY manager DESC";

    // Query from connection
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('\n');

        // Display query results using console.table
        console.table(result[3]);

        // Back to main menu
        mainMenu();
    });
};


// Add new Employee to employee table
const addEmployee = () => {
    let employeesArray = [];
    //Connection to query to select all employees from employee table and pushing rows into an array
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }

        let rolesArray = [];
        //Connection to query to select all roles from role table and pushing rows into an array
        connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            }

            let managersArray = [];
            //Connection to query to select all manager from employee table and pushing rows into an array
            connection.query("SELECT first_name, last_name FROM employee WHERE manager_id = 0", function (err, res) {
                if (err) throw err
                for (var i = 0; i < res.length; i++) {
                    managersArray.push(`${res[i].first_name} ${res[i].last_name}`);
                }


                // Prompt user to insert information 
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
                        choices: rolesArray,
                    },
                    {
                        type: 'list',
                        message: "Who is the employee's manager ?",
                        name: 'managers',
                        choices: managersArray,

                    }]).then((answers) => {
                        const roleId = rolesArray.indexOf(answers.roles) + 1;
                        const managerId = employeesArray.indexOf(answers.managers) + 1;

                        //Connection to query to insert a new employee into employee table
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

                        // Back to main menu
                        mainMenu();
                    });
            });
        });
    });
};

//Remove an Employee from employee table
const removeEmployee = () => {
    let employeesArray = [];
    //Connection to query to select all employees from employee table and pushing rows into an array
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }

        // Prompt user to select an employee
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: "What is the employee's role ?",
                choices: employeesArray,

            }]).then((answers) => {
                const employeeId = employeesArray.indexOf(answers.employeeName) + 1;

                //Connection to query to delete the selected employee from employee table
                connection.query('DELETE FROM employee WHERE ?',
                    {
                        id: employeeId,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`\n ${answers.employeeName} was successfully deleted from the database`);
                    }
                );

                // Back to main menu
                mainMenu();
            });
    });
};

// Update Employee's role in employee table
const UpdateEmployeeRole = () => {
    let employeesArray = [];
    //Connection to query to select all employees from employee table and pushing rows into an array
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }

        let rolesArray = [];
        //Connection to query to select all roles from role table and pushing rows into an array
        connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            }

            // Prompt user to select an employee and to choose a role
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
                    choices: rolesArray,

                }]).then((answers) => {
                    const employeeId = employeesArray.indexOf(answers.employeeName) + 1;
                    const roleId = rolesArray.indexOf(answers.employeeRole) + 1;

                    //Connection to query to update the role of the selected employee in the employee table
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

                    // Back to main menu
                    mainMenu();
                });
        });
    });
};

// Update Employee's manager in employee table
const UpdateEmployeeManager = () => {
    let employeesArray = [];
    connection.query("SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee", function (err, employees) {
        if (err) throw err;
        for (i = 0; i < employees.length; i++) {
            employeesArray.push(employees[i].name);
        }

        let managersArray = [];
        //Connection to query to select all manager from employee table and pushing rows into an array
        connection.query("SELECT first_name, last_name FROM employee WHERE manager_id = 0", function (err, res) {
            if (err) throw err
            for (var i = 0; i < res.length; i++) {
                managersArray.push(`${res[i].first_name} ${res[i].last_name}`);
            }

            // Prompt user to select an employee and to choose a manager
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
                    choices: managersArray,

                }]).then((answers) => {
                    const employeeId = employeesArray.indexOf(answers.employeeName) + 1;
                    const managerId = employeesArray.indexOf(answers.employeeManager) + 1;

                    //Connection to query to update the manager of the selected employee in the employee table
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

                    // Back to main menu
                    mainMenu();
                });
        });
    });
};

// Establishing Connection to database
connection.connect((err) => {
    if (err) throw err;
    mainMenu();
});