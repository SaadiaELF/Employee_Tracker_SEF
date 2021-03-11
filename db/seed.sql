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

INSERT INTO role (first_name, last_name, role_id, manager_id)
VALUES 
('Sale Lead', 100000, 2) ,
('Salesperson', 80000, 2) ,
('Accountant', 125000,3) ,
('Legal Team Lead', 250000, 4) ,
('Lawyer', 190000, 4) ,
('Lead Engineer', 150000, 1) ,
('Software Engineer', 125000, 1) ;