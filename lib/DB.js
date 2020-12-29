const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
let allDataQuery = `SELECT employee.id, employee.first_name, employee.last_name, role_table.title, role_table.salary, department.department_name 
                      FROM employee 
                     INNER JOIN role_table ON role_table.id=employee.role_id 
                     INNER JOIN department ON role_table.department_id=department.id
                     ORDER BY employee.id ASC `;

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

  getAllDepartments = function (callback) {
    const sql = "SELECT * FROM department";
    this.connection.query(sql, function (error, results) {
      if (error) {
        return callback(error);
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

  addDepartment = (department, callback) => {
    const sql = mysql.format("INSERT INTO department SET ?", {
      department_name: department,
    });
    this.connection.query(sql, (error, result) => {
      if (error) return error;
      console.log(`\nDepartment "${department}" added successfully.\n`);
      callback(result);
    });
  };

  addRole = (title, salary, department_id, callback) => {
    const sql = mysql.format("INSERT INTO role_table SET ?", {
      title: title,
      salary: salary,
      department_id: department_id,
    });
    this.connection.query(sql, (error, result) => {
      if (error) return error;
      console.log(`\nRole "${title}" added successfully.\n`);
      callback(result);
    });
  };

  addEmployee = (firstName, lastName, roleId, managerId, callback) => {
    const sql = mysql.format("INSERT INTO employee SET ?", {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId,
    });
    this.connection.query(sql, (error, result) => {
      if (error) return error;
      console.log(`\n${firstName} ${lastName} added successfully.\n`);
      callback(result);
    });
  };

  deleteEmployeeById = (id, name, callback) => {
    const sql = mysql.format("DELETE FROM employee WHERE ?", [
      {
        id: id,
      },
    ]);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      if (results.affectedRows < 1) {
        console.log(`\nError - ${id} not found.\n`);
      } else {
        console.log(`\n${id} ${name} deleted successfully.\n`);
      }
      return callback(results);
    });
  };

  updateRoleInDB = (employeeId, name, newRoleId, newRoleName, callback) => {
    const sql = mysql.format("UPDATE employee SET ? WHERE ?", [
      {
        role_id: newRoleId,
      },
      {
        id: employeeId,
      },
    ]);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      if (results.affectedRows < 1) {
        console.log(`\nError - ${employeeId} ${name} not found.\n`);
      } else {
        console.log(`\n${employeeId} ${name} updated to role ${newRoleName}.\n`);
      }
      return callback(results);
    });
  };

  removeEmployee = (cb) => {
    this.connection.query("SELECT id, first_name, last_name FROM employee", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "empToRemove",
            type: "list",
            message: "Select the employee to remove:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(e.id + "  " + e.first_name + " " + e.last_name));
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          const id = answer.empToRemove.substr(0, answer.empToRemove.indexOf(" ")).trim();
          const name = answer.empToRemove.substr(answer.empToRemove.indexOf(" ")).trim();
          this.deleteEmployeeById(id, name, (res) => {
            cb(res);
          });
        });
    });
  };

  updateEmployeeRole = (cb) => {
    this.connection.query("SELECT id, first_name, last_name FROM employee", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "empToUpdate",
            type: "list",
            message: "Select the employee to update:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(e.id + "  " + e.first_name + " " + e.last_name));
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          const employeeId = answer.empToUpdate.substr(0, answer.empToUpdate.indexOf(" ")).trim();
          const employeeName = answer.empToUpdate.substr(answer.empToUpdate.indexOf(" ")).trim();
          this.connection.query("SELECT id, title FROM role_table", (error, results) => {
            if (error) throw error;
            inquirer
              .prompt([
                {
                  name: "selectRole",
                  type: "list",
                  message: "Select new role:",
                  choices: function () {
                    let choiceArray = [];
                    results.forEach((e) => choiceArray.push(e.id + " " + e.title));
                    return choiceArray;
                  },
                },
              ])
              .then((answer) => {
                const newRoleId = answer.selectRole.substr(0, answer.selectRole.indexOf(" ")).trim();
                const roleName = answer.selectRole.substr(answer.selectRole.indexOf(" ")).trim();
                this.updateRoleInDB(employeeId, employeeName, newRoleId, roleName, (res) => {
                  cb(res);
                });
              });
          });
        });
    });
  };

  getTotalBudget = (callback) => {
    const sql = mysql.format(`SELECT SUM(role_table.salary)
      FROM employee
      INNER JOIN role_table ON role_table.id=employee.role_id
      INNER JOIN department ON role_table.department_id=department.id;`);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      return callback(results);
    });
  };
}

module.exports = DB;
