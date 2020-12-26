const mysql = require("mysql");
const util = require("util");
const cTable = require("console.table");
const { log } = require("console");
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

  // async getAllEmployees() {
  //   const query = util.promisify(this.connection.query).bind(this.connection);
  //   (async () => {
  //     try {
  //       const rows = await query(allDataQuery);
  //       console.table(rows);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       this.connection.end();
  //     }
  //   })();
  // }

  // async getEmployeesByDepartment(department) {
  //   const query = util.promisify(this.connection.query).bind(this.connection);
  //   (async (test) => {
  //     try {
  //       const rows = await query(allDataQuery + "WHERE department.department_name=?", { department_name: department });
  //       console.table(rows);
  //       return rows;
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       this.connection.end();
  //     }
  //   })();
  // }

  // async getAllRoles() {
  //   const query = util.promisify(this.connection.query).bind(this.connection);
  //   (async () => {
  //     try {
  //       const rows = await query("SELECT * FROM role_table");
  //       console.table(rows);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       this.connection.end();
  //     }
  //   })();
  // }

  // async getAllDepartments2() {
  //   const query = util.promisify(this.connection.query).bind(this.connection);
  //   query.then((result) => {
  //     return result;
  //   });
  //   // return await query("SELECT * FROM department");
  // }

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

  // async getAllDepartments() {
  //   const query = util.promisify(this.connection.query).bind(this.connection);
  //   (async () => {
  //     try {
  //       return await query("SELECT * FROM department");
  //       // console.table(rows);
  //       // const promise = Promise.resolve(rows);
  //       // const values = Object.values(rows);
  //       // return rows;
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       this.connection.end();
  //     }
  //   })();
  // }

  async addRole(title, salary, department_id) {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async (done) => {
      try {
        const rows = await query("INSERT INTO role_table SET ?", {
          title: title,
          salary: salary,
          department_id: department_id,
        });
        console.log("Role Added. Affected Rows: " + rows.affectedRows);
      } catch (error) {
        console.log(error);
      } finally {
        if (done) this.connection.end();
      }
    })();
  }

  async addDepartment(department_name) {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async (done) => {
      try {
        const rows = await query("INSERT INTO department SET ?", {
          department_name: department_name,
        });
        console.log(rows);
      } catch (error) {
        console.log(error);
      } finally {
        if (done) this.connection.end();
      }
    })();
  }

  //   async addEmployee(firstName, lastName, roleId, managerId) {
  //     const query = util.promisify(this.connection.query).bind(this.connection);
  //     (async (done) => {
  //       try {
  //         const rows = await query("INSERT INTO employee SET ?", {
  //           first_name: firstName,
  //           last_name: lastName,
  //           role_id: roleId,
  //           manager_id: managerId,
  //         });
  //         console.log(rows);
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         if (done) this.connection.end();
  //       }
  //     })();
  //   }
  // }

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
