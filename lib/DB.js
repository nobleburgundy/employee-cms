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

  getAllRowData = function (callback) {
    const sql = "SELECT * FROM role_table";
    this.connection.query(sql, function (error, results) {
      if (error) {
        return error;
      }
      return callback(results);
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
          choices: this.getAllRoles((res) => {
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

  updateRoleInDB = (employeeId, fullName, newRoleId, newRoleName, callback) => {
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
        callback(`\nError - ${fullName} with ID ${employeeId} not found.\n`);
      } else {
        callback(`\nSuccess - ${fullName} updated to role '${newRoleName}'.\n`);
      }
    });
  };

  updateEmployeeNameInDB = (employeeId, newFirstName, newLastName, callback) => {
    const sql = mysql.format("UPDATE employee SET ? WHERE ?", [
      {
        first_name: newFirstName,
        last_name: newLastName,
      },
      {
        id: employeeId,
      },
    ]);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      if (results.affectedRows < 1) {
        return callback(`\nError - Employee ID '${employeeId}' not found.\n`);
      } else {
        return callback(`\nSuccess - Employee ID '${employeeId}' name updated to ${newFirstName} ${newLastName}.\n`);
      }
    });
  };

  updateManagerInDb = (employeeId, name, newManagerId, newManagerName, callback) => {
    const sql = mysql.format("UPDATE employee SET ? WHERE ?", [
      {
        manager_id: newManagerId,
      },
      {
        id: employeeId,
      },
    ]);
    this.connection.query(sql, (error, results) => {
      if (error) return error;
      if (results.affectedRows < 1) {
        return callback(`\nError - Employee ${name} ID '${employeeId}' not found.\n`);
      } else if (newManagerId === null) {
        return callback(`\nSuccess - Employee ID '${employeeId}' manager successfully removed.\n`);
      } else {
        return callback(`\nSuccess - ${name}'s manager updated to ${newManagerName}.\n`);
      }
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

  updateEmployeeRole = (employeeId, fullName, cb) => {
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
          this.updateRoleInDB(employeeId, fullName, newRoleId, roleName, (res) => {
            cb(res);
          });
        });
    });
  };

  getNameFromId = (id, callback) => {
    this.connection.query(
      "SELECT CONCAT(first_name, ' ', last_name) 'full_name' FROM employee WHERE ?",
      [
        {
          id: id,
        },
      ],
      (error, results) => {
        if (error) throw error;
        return callback(results[0].full_name);
      }
    );
  };

  selectEmployee = (message, additionalItemsArray, callback) => {
    this.connection.query("SELECT id, first_name, last_name FROM employee", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: message,
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(`${e.id} ${e.first_name} ${e.last_name}`));
              if (additionalItemsArray) {
                choiceArray.push(...additionalItemsArray);
              }
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          return callback(answer.employee);
        });
    });
  };

  editEmployee = (callback) => {
    // select employee
    //  edit name, edit role, edit department
    this.connection.query("SELECT id, first_name, last_name FROM employee", (error, results) => {
      if (error) throw error;
      inquirer
        .prompt([
          {
            name: "employeeSelection",
            type: "list",
            message: "Select the employee to edit:",
            choices: function () {
              let choiceArray = [];
              results.forEach((e) => choiceArray.push(`${e.id} ${e.first_name} ${e.last_name}`));
              return choiceArray;
            },
          },
        ])
        .then((employee) => {
          // choose name, role, or manager to edit
          inquirer
            .prompt([
              {
                name: "selection",
                type: "list",
                message: "What field would you like to edit?",
                choices: ["Name", "Role", "Manager"],
              },
            ])
            .then((whatToEdit) => {
              const empId = employee.employeeSelection.substr(0, employee.employeeSelection.indexOf(" ")).trim();
              // get string between two spaces - ie "1 First Last"
              const firstName = employee.employeeSelection
                .substr(employee.employeeSelection.indexOf(" "), employee.employeeSelection.lastIndexOf(" "))
                .trim();
              // get string starting at last space - ie "1 First Last"
              const lastName = employee.employeeSelection.substr(employee.employeeSelection.lastIndexOf(" ")).trim();
              const fullName = `${firstName} ${lastName}`;
              switch (whatToEdit.selection) {
                case "Name":
                  inquirer
                    .prompt([
                      {
                        name: "newFirstName",
                        type: "input",
                        message: "Enter new first name (hit Enter to accept previous entry)::",
                        default: firstName,
                      },
                      {
                        name: "newLastName",
                        type: "input",
                        message: "Enter new last name (hit Enter to accept previous entry):",
                        default: lastName,
                      },
                    ])
                    .then((answer3) => {
                      // if different, update in DB
                      if (answer3.newFirstName !== firstName || answer3.newLastName !== lastName) {
                        this.updateEmployeeNameInDB(empId, answer3.newFirstName, answer3.newLastName, (res) => {
                          callback(res);
                        });
                      } else {
                        callback("No changes found. Name update not performed.");
                      }
                    });
                  break;
                case "Role":
                  this.updateEmployeeRole(empId, fullName, (res) => {
                    callback(res);
                  });
                  break;
                default:
                  // manager was chosen
                  this.selectEmployee("Select the new manager:", ["No Manager"], (res) => {
                    // selectEmployee returns id and full name, so just need id and name substrings
                    let newManagerId = res.substr(0, res.indexOf(" ")).trim();
                    let newManagerName = res.substr(res.indexOf(" ")).trim();
                    if (newManagerId === "No") {
                      newManagerId = null;
                      newManagerName = null;
                    }
                    this.updateManagerInDb(empId, fullName, newManagerId, newManagerName, (res) => {
                      callback(res);
                    });
                  });
                  break;
              }
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
