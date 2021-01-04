const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
let allDataQuery = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department_name, CONCAT(m.first_name, " ", m.last_name) "manager"
  FROM employee e
  LEFT JOIN employee m ON m.id=e.manager_id
  INNER JOIN role_table r ON r.id=e.role_id 
  INNER JOIN department d ON r.department_id=d.id `;
let totalBudgetQuery = `SELECT SUM(role_table.salary)
  FROM employee
  INNER JOIN role_table ON role_table.id=employee.role_id
  INNER JOIN department ON role_table.department_id=department.id `;
let currencyFormat = (number) => {
  return new Intl.NumberFormat("us-US", { style: "currency", currency: "USD" }).format(number);
};

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
      if (error) throw error;
      return callback(results);
    });
  };

  viewEmployeesByDepartment = (callback) => {
    this.connection.query("SELECT department_name FROM department", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "department",
            type: "list",
            message: "Select department:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(e.department_name));
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          const sql = mysql.format(allDataQuery + "WHERE ?", { department_name: answer.department });
          this.connection.query(sql, (error, results) => {
            if (error) return error;
            if (results.length < 1) {
              return callback(`\nNo employees found under department '${answer.department}'\n`);
            } else {
              return callback(results);
            }
          });
        });
    });
  };

  viewEmployeesByRole = (callback) => {
    this.connection.query("SELECT id, title FROM role_table", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "role",
            type: "list",
            message: "Select role:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(e.id + " " + e.title));
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          const roleId = answer.role.substr(0, answer.role.indexOf(" "));
          const roleName = answer.role.substr(answer.role.indexOf(" ")).trim();
          const sql = mysql.format(allDataQuery + "WHERE ?", { "e.role_id": roleId });
          this.connection.query(sql, (error, results) => {
            if (error) return error;
            if (results.length < 1) {
              return callback(`\nNo employees found under role '${roleName}'\n`);
            } else {
              return callback(results);
            }
          });
        });
    });
  };

  addDepartment = (callback) => {
    inquirer
      .prompt({
        name: "department",
        message: "Department name:",
        type: "Input",
      })
      .then((answer) => {
        const sql = mysql.format("INSERT INTO department SET ?", {
          department_name: answer.department,
        });
        this.connection.query(sql, (error, result) => {
          if (error) return error;
          console.log(`\nDepartment "${answer.department}" added successfully.\n`);
          callback(result);
        });
      });
  };

  addRole = (callback) => {
    inquirer
      .prompt([
        {
          name: "title",
          message: "Role Title:",
          type: "input",
        },
        {
          name: "salary",
          message: "Role Salary:",
          type: "input",
        },
        {
          name: "department_id",
          message: "Department Id: ",
          type: "input",
        },
      ])
      .then((answer) => {
        const sql = mysql.format("INSERT INTO role_table SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        });
        this.connection.query(sql, (error, result) => {
          if (error) return error;
          console.log(`\nRole "${answer.title}" added successfully.\n`);
          callback(result);
        });
      });
  };

  getRoles(cb) {
    const roleArray = [];
    this.connection.query("SELECT id, title FROM role_table", (error, results) => {
      if (error) throw error;
      results.forEach((e) => roleArray.push(e.id + " " + e.title));
      return roleArray;
    });
    return cb(roleArray);
  }

  getManagers(cb) {
    const managerArray = [];
    this.connection.query("SELECT id, first_name, last_name FROM employee", (error, results) => {
      if (error) throw error;
      results.forEach((e) => managerArray.push(e.id + " " + e.first_name + " " + e.last_name));
      // add 'No manager' as an option
      managerArray.push("No Manager");
      return managerArray;
    });
    return cb(managerArray);
  }

  addEmployee = function (callback) {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the employees first and last name:",
          name: "fullName",
        },
        {
          type: "list",
          message: "Select employee role:",
          name: "roleList",
          choices: this.getRoles((res) => {
            return res;
          }),
        },
        {
          type: "list",
          message: "Select employee manager:",
          name: "managerList",
          choices: this.getManagers((res) => {
            return res;
          }),
        },
      ])
      .then((answer) => {
        const firstName = answer.fullName.substr(0, answer.fullName.indexOf(" "));
        const lastName = answer.fullName.substr(answer.fullName.indexOf(" "));
        const roleId = answer.roleList.substr(0, answer.roleList.indexOf(" "));
        let managerId = answer.managerList.substr(0, answer.managerList.indexOf(" "));
        if (managerId === "No") {
          managerId = null;
        }
        console.log("manager id = " + managerId);
        const sql = mysql.format("INSERT INTO employee SET ?", {
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
          manager_id: managerId,
        });
        connection.query(sql, (error, result) => {
          if (error) return error;
          console.log(`\n${firstName} ${lastName} added successfully.\n`);
          callback(result);
        });
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
    const sql = mysql.format(totalBudgetQuery);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      // format the output to currency
      const budget = currencyFormat(results[0]["SUM(role_table.salary)"]);
      return callback(budget);
    });
  };

  getBudgetByDepartment = (callback) => {
    this.connection.query("SELECT department_name FROM department", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "department",
            type: "list",
            message: "Select department:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(e.department_name));
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          let sql = mysql.format(totalBudgetQuery + "WHERE ?", [{ department_name: answer.department }]);
          this.connection.query(sql, (error, results) => {
            if (error) throw error;
            // return object with formatted currency, or 0 (no employees)
            const sum =
              results[0]["SUM(role_table.salary)"] > 0 ? currencyFormat(results[0]["SUM(role_table.salary)"]) : 0;
            const budget = { department: answer.department, budget: sum };
            return callback(budget);
          });
        });
    });
  };

  endConnection = (cb) => {
    return cb(this.connection.end());
  };
}

module.exports = DB;
