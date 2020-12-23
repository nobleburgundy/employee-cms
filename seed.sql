USE employee_management_db;

INSERT INTO department (department_name)
	 VALUES ("Engineering"), ("Sales"), ("Marketing"), ("Accounting");

INSERT INTO role_table (title, salary, department_id)
	 VALUES ("Engineering Manager", "150000", 1),
            ("Software Engineer I", "80000", 1),
            ("Software Engineer II", "120000", 1),
            ("Project Manager", "150000", 1),
            ("Scrum Master", "80000", 1),
            ("QA Engineer", "100000", 1),
            ("Sales Manager", "150000", 2),
            ("Sales Engineer I", "80000", 2),
            ("Sales Engineer II", "120000", 2),
            ("Accountant I", "100000", 4),
            ("Account Manager", "150000", 4),
            ("CEO", "1", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Melany", "DeJona", 1, NULL),
	   ("Johnny", "Smith", 2, 1),
       ("Jimmy", "Smith", 4, 1),
       ("Jackson", "Jones", 11, NULL),
       ("Aretha", "Mulburry", 5, 3),
       ("Elizabeth", "Tracey", 3, 1),
       ("Wes", "Evans", 7, 5),
       ("Jerry", "Jerry", 9, NULL);


     