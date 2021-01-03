const DB = require("./lib/DB");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const config = require("./package.json");
const db = new DB();

console.log(
  logo({
    name: "Employee CMS",
    font: "Speed",
    lineChars: 10,
    padding: 1,
    margin: 3,
    borderColor: "white",
    logoColor: "cyan",
  })
    .emptyLine()
    .right(`Version: ${config.version}`)
    .right(config.description)
    .render()
);

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
        "View Total Utilized Budget",
        "View Utilized Budget By Department",
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
          db.viewEmployeesByDepartment((res) => {
            console.table(res);
            start();
          });
          break;
        case "View Employees By Role":
          db.viewEmployeesByRole((res) => {
            console.table(res);
            start();
          });
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
          // addEmployee();
          db.addEmployee2((res) => {
            console.log(res);
            start();
          });
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
        case "View Total Utilized Budget":
          db.getTotalBudget((res) => {
            console.log(`\nTotal Utilized Budget: ${res}\n`);
            start();
          });
          break;
        case "View Utilized Budget By Department":
          db.getBudgetByDepartment((res) => {
            if (res.budget === 0) {
              console.log(`\nNo employees yet in the ${res.department} department.`);
            } else {
              console.log(`\n${res.department} Department Budget: ${res.budget}\n`);
            }
            start();
          });
          break;
        default:
          // Exit was choosen
          db.endConnection(() => {
            console.log("\nThank you for using Employee CMS CLI!\n");
          });
      }
    });
}

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
