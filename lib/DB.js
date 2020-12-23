const mysql = require("mysql");
const cTable = require("console.table");
let allDataQuery = `SELECT employee.id, employee.first_name, employee.last_name, role_table.title, role_table.salary, department.department_name 
FROM employee 
INNER JOIN role_table ON role_table.id=employee.role_id 
INNER JOIN department ON role_table.department_id=department.id `;

class DB {
  constructor() {
    this.store = [];
    this.connection = this.connect();
  }

  connect = () =>
    mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "jamesmysql",
      database: "employee_management_db",
    });

  getAllEmployees() {
    this.connection.query(allDataQuery, (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  getAllEmployeesByDepartment = (department) => {
    this.getAllBy("department_name", "Engineering");
  };

  getAllBy(table, column) {
    this.connection.query(allDataQuery + `WHERE ?`, { [table]: column }, (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  getAllRoles() {
    this.connection.query("SELECT * FROM role_table", (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  getAllDepartments() {
    this.connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  }

  addRole(title, salary, department_id) {
    this.connection.query("INSERT INTO role_table SET ?", {
      title: title,
      salary: salary,
      department_id: department_id,
    });
  }

  addDepartment(department_name) {
    this.connection.query("INSERT INTO department SET ?", {
      department_name: department_name,
    });
  }

  addEmployee(firstName, lastName, roleId, managerId) {
    this.connection.query("INSERT INTO employee SET ?", {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId,
    });
  }

  // Add departments, roles, employees
  // View departments, roles, employees
  // Update employee roles

  // Bonus points if you're able to:
  // Update employee managers
  // View employees by manager
  // Delete departments, roles, and employees
  // View the total utilized budget of a department -- ie the combined salaries of all employees in that department
}

module.exports = DB;
