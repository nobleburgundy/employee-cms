const mysql = require("mysql");
const util = require("util");
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

  async getAllEmployees() {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async () => {
      try {
        const rows = await query(allDataQuery);
        console.table(rows);
      } catch (error) {
        console.log(error);
      } finally {
        this.connection.end();
      }
    })();
  }

  async getAllRoles() {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async () => {
      try {
        const rows = await query("SELECT * FROM role_table");
        console.table(rows);
      } catch (error) {
        console.log(error);
      } finally {
        this.connection.end();
      }
    })();
  }

  async getAllDepartments() {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async () => {
      try {
        const rows = await query("SELECT * FROM department");
        console.table(rows);
      } catch (error) {
        console.log(error);
      } finally {
        this.connection.end();
      }
    })();
  }

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

  async addEmployee(firstName, lastName, roleId, managerId) {
    const query = util.promisify(this.connection.query).bind(this.connection);
    (async (done) => {
      try {
        const rows = await query("INSERT INTO employee SET ?", {
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
          manager_id: managerId,
        });
        console.log(rows);
      } catch (error) {
        console.log(error);
      } finally {
        if (done) this.connection.end();
      }
    })();
  }
}

module.exports = DB;
