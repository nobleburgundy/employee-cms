DROP DATABASE IF EXISTS employee_management_db;
CREATE DATABASE employee_management_db;

USE employee_management_db;

CREATE TABLE employee (
	id INT AUTO_INCREMENT,
	first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE role_table (
	id INT AUTO_INCREMENT,
	title VARCHAR(30),
    salary VARCHAR(30),
    department_id int,
	PRIMARY KEY (id)
);

CREATE TABLE department (
	id INT AUTO_INCREMENT,
	department_name VARCHAR(30),
	PRIMARY KEY (id)
);

-- Basic join query
SELECT employee.id, employee.first_name, employee.last_name, role_table.title, role_table.salary, department.department_name
  FROM employee
 INNER JOIN role_table ON role_table.id=employee.role_id
 INNER JOIN department ON role_table.department_id=department.id;