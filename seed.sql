USE employee_management_db;

INSERT INTO employee (first_name, last_name)
VALUES ("Melany", "DeJona"),
	   ("Johnny", "Smith"),
       ("Jimmy", "Smith"),
       ("Jackson", "Jones"),
       ("Aretha", "Mulburry"),
       ("Elizabeth", "Tracey"),
       ("Wes", "Evans");
       
INSERT INTO role (title, salary)
	 VALUES ("Engineering Manager", "150000"),
            ("Software Engineer I", "80000"),
            ("Software Engineer II", "120000"),
            ("Project Manager", "150000"),
            ("Scrum Master", "80000"),
            ("QA Engineer", "100000"),
            ("Sales Manager", "150000"),
            ("Sales Engineer I", "80000"),
            ("Sales Engineer II", "120000"),
            ("Accountant I", "100000"),
            ("Account Manager", "150000");

INSERT INTO department (name)
	 VALUES ("Engineering"), ("Sales"), ("Marketing"), ("Accounting");
