DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role_table;
DROP TABLE IF EXISTS department;

DROP DATABASE IF EXISTS employee_management_db;

CREATE DATABASE employee_management_db;

USE employee_management_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT,
	department_name VARCHAR(30) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE role_table (
	id INT AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
	PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT,
	first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee (id), 
    FOREIGN KEY (role_id) REFERENCES role_table (id),
    PRIMARY KEY (id)
);
