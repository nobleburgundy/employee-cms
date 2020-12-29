const DB = require("./lib/DB");
const inquirer = require("inquirer");
const db = new DB();

start();

function start() {
  inquirer
    .prompt({
      name: "whatToDo",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View All Employees",
        "View Employees By Department",
        "View Employees By Role",
        "View Departments",
        "View Roles",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Add Role",
        "Add Department",
        "View Total Budget",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.whatToDo) {
        case "View All Employees":
          db.getAllEmployees((results) => {
            console.table(results);
            start();
          });
          break;
        case "View Employees By Department":
          viewByDepartment();
          break;
        case "View Employees By Role":
          viewByRole();
          break;
        case "View Roles":
          db.getAllRoles((res) => {
            console.table(res);
            start();
          });
          break;
        case "View Departments":
          db.getAllDepartments((res) => {
            console.table(res);
            start();
          });
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Employee":
          db.removeEmployee(() => {
            start();
          });
          break;
        case "Update Employee Role":
          db.updateEmployeeRole(() => {
            start();
          });
          break;
        case "View Total Budget":
          db.getTotalBudget((res) => {
            console.log("\nTotal Budget: " + res[0]["SUM(role_table.salary)"] + "\n");
            start();
          });
          break;
        default:
          // Exit was choosen
          break;
      }
    });
}

viewByDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      message: "Which department?",
      type: "input",
    })
    .then((answer) => {
      db.getEmployeeByDepartment(answer.department, (res) => {
        console.table(res);
        start();
      });
    });
};

viewByRole = () => {
  inquirer
    .prompt({
      name: "role",
      message: "Which role?",
      type: "input",
    })
    .then((answer) => {
      db.getEmployeesByRole(answer.role, (res) => {
        console.table(res);
        start();
      });
    });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "First Name:",
        type: "input",
      },
      {
        name: "lastName",
        message: "Last Name:",
        type: "input",
      },
      {
        name: "roleId",
        message: "Role Id: ",
        type: "input",
      },
      {
        name: "managerId",
        message: "Manager Id: ",
        type: "input",
      },
    ])
    .then((answer) => {
      db.addEmployee(answer.firstName, answer.lastName, answer.roleId, answer.managerId, () => {
        start();
      });
    });
};

addRole = () => {
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
        name: "departmentId",
        message: "Department Id: ",
        type: "input",
      },
    ])
    .then((answer) => {
      db.addRole(answer.title, answer.salary, answer.departmentId, () => {
        start();
      });
    });
};

addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      message: "Department name:",
      type: "Input",
    })
    .then((answer) => {
      db.addDepartment(answer.department, () => {
        start();
      });
    });
};
