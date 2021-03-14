CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
id INTEGER(10) AUTO_INCREMENT NOT NULL,
department VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INTEGER(10) AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(20,2) NOT NULL,
department_id  INTEGER(10) NOT NULL DEFAULT 1, 
PRIMARY KEY (id),
INDEX (department_id),
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE CASCADE
);

CREATE TABLE employee (
id INTEGER(10) AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id  INTEGER(10) NOT NULL, 
manager_id  INTEGER(10), 
PRIMARY KEY (id),
INDEX (role_id),
INDEX (manager_id),
FOREIGN KEY (role_id)
REFERENCES role(id)
ON DELETE CASCADE,
FOREIGN KEY (manager_id)
REFERENCES employee(id)
);
