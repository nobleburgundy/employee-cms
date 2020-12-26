const mysql = require("mysql");
const util = require("util");
const cTable = require("console.table");
// const { log } = require("console");
let allDataQuery = `SELECT employee.id, employee.first_name, employee.last_name, role_table.title, role_table.salary, department.department_name 
                      FROM employee 
                     INNER JOIN role_table ON role_table.id=employee.role_id 
                     INNER JOIN department ON role_table.department_id=department.id `;

class DB {
  constructor() {
    this.store = [];
    this.connection = mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "jamesmysql",
      database: "employee_management_db",
    });
  }

  getAllRoles = function (callback) {
    const sql = "SELECT * FROM role_table";
    this.connection.query(sql, function (error, results) {
      if (error) {
        return error;
      }
      return callback(results);
    });
  };

  endConnecton = function () {
    this.connection.end();
  };

  getAllDepartments = function (callback) {
    const sql = "SELECT * FROM department";
    this.connection.query(sql, function (error, results) {
      if (error) {
        return error;
      }
      return callback(results);
    });
  };

  getAllEmployees = (callback) => {
    this.connection.query(allDataQuery, (error, results) => {
      if (error) return error;
      return callback(results);
    });
  };

  getEmployeeByDepartment = (department, callback) => {
    const sql = mysql.format(allDataQuery + "WHERE ?", { department_name: department });
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      return callback(results);
    });
  };

  getEmployeesByRole = (role, callback) => {
    const sql = mysql.format(allDataQuery + "WHERE ?", { title: role });
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      return callback(results);
    });
  };

  addDepartment = (department) => {
    const sql = mysql.format("INSERT INTO department SET ?", {
      department_name: department,
    });
    this.connection.query(sql, (error) => {
      if (error) return error;
      console.log(`${department} added successfully!`);
    });
  };

  addRole = (title, salary, department_id) => {
    const sql = mysql.format("INSERT INTO role_table SET ?", {
      title: title,
      salary: salary,
      department_id: department_id,
    });
    this.connection.query(sql, (error) => {
      if (error) return error;
      console.log(`${title} added successfully!`);
    });
  };

  addEmployee = (firstN, lastN, roleId, managerId) => {
    const sql = mysql.format("INSERT INTO employee SET ?", {
      first_name: firstN,
      last_name: lastN,
      role_id: roleId,
      manager_id: managerId,
    });
    this.connection.query(sql, (error) => {
      if (error) return error;
      console.log(`${firstN} ${lastN} added successfully!`);
    });
  };
}

module.exports = DB;
