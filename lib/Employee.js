const Department = require("./Department");
const Role = require("./Role");

class Employee {
  constructor(firstName, lastName, roleName, manager) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleName = roleName;
    this.role = new Role(roleName);
    this.manager = manager;
    this.department = new Department(roleName);
  }
}

getFirstName = () => this.firstName;
getLastName = () => this.lastName;
getRole = () => this.roleName;
getManager = () => this.manager;

module.exports = Employee;

const emp1 = {
  firstName: "",
  lastName: "",
  roleName: "",
  roleId: "",
};
