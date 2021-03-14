USE employee_db;
INSERT INTO department (department)
VALUES 
('Engineering') ,
('Sales') ,
('Finance') ,
('Legal') ;

INSERT INTO role (title, salary, department_id)
VALUES 
('Sale Lead', 100000, 2) ,
('Salesperson', 80000, 2) ,
('Accountant', 125000,3) ,
('Legal Team Lead', 250000, 4) ,
('Lawyer', 190000, 4) ,
('Lead Engineer', 150000, 1) ,
('Software Engineer', 125000, 1) ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Sara', 'Salim', 2, 2) ,
('Mary', 'Chloe', 1, 0) ,
('Ahmed', 'Daif', 3, 0) ,
('John', 'Drew', 6, 0) ,
('Peter', 'Davies', 5, 7) ,
('Saadia', 'Youssef', 7, 4) ,
('Mai', 'Umar', 4, 0) ;
