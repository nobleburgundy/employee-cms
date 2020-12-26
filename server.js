const DB = require("./lib/DB");
const inquirer = require("inquirer");

const db = new DB();
// db.getAllEmployees();
// db.getAllEmployeesByDepartment("Engineering");
// db.addRole("QA Engineer II", "120000", 1);
// db.getAllRoles();

// db2.addRole("QA Technician X", "125000", 3);
// db2.getAllEmployees();
// db2.getAllRoles();

// let departments = db.getAllDepartments(function (res) {
//   res.forEach((element) => {
//     console.log(element.department_name);
//   });
// });

// let depArr = [];
// db.getAllEmployees((cb) => {
//   cb.forEach((d) => {
//     console.log(d.department_name);
//     depArr.push(d.department_name);
//   });
//   console.log(depArr);
// });

// const genList = (list) => {
//   const choices = list.map((item, index) => {
//     return {
//       key: index,
//       name: `${item.id}`,
//     };
//   });
//   return {
//     type: "rawlist",
//     message: "Which order to pick",
//     name: "orders",
//     choices: choices,
//   };
// };

// let roles = db.getAllRoles(function (res) {
//   res.forEach((element) => {
//     console.log(element.title);
//   });
// });

// db.getEmployeeByDepartment("Sales", (res) => {
//   console.table(res);
// });

// db.endConnecton();
// db.getAllDepartments();
// console.log(roles);

// db.addEmployee("James", "Gould", 3, 6);
// db.getAllEmployees();
start();
function start() {
  inquirer
    .prompt({
      name: "whatToDo",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.whatToDo) {
        case "View All Employees":
          db.getAllEmployees((results) => {
            console.table(results);
          });
          break;
        case "View All Employees By Department":
          viewByDepartment();
          break;
        case "View All Employees By Role":
          viewByRole();
          break;
        case "Add Employee":
          addEmployee();
        default:
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
      });
    })
    .finally(() => {
      db.endConnecton();
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
      });
    })
    .finally(() => {
      db.endConnecton();
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
      db.addEmployee(answer.firstName, answer.lastName, answer.roleId, answer.managerId);
    })
    .finally(() => {
      db.endConnecton();
    });
};
