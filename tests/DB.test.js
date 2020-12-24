const DB = require("../lib/DB");

describe("DB Class Tests", () => {
  describe("Initilization", () => {
    it("Should create an object when intialized", () => {
      const db = new DB();

      expect(typeof db).toBe("object");
      expect(db instanceof DB).toBe(true);
    });

    it("DB connection should connect to the 'employee_management_db' without error", () => {
      const db = new DB();

      expect(db.connection.config.database).toBe("employee_management_db");
    });
  });

  describe("DB add functions", () => {
    it("addRole", () => {
      const db = new DB();
      const testRole = "test" + Math.random();
      const mock = jest.spyOn(db, "addRole");
      mock.mockImplementation(() => {});
      db.addRole(testRole);

      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(testRole);
      mock.mockRestore();
    });

    it("addDepartment", () => {
      const db = new DB();
      const testDepartment = "test" + Math.random();
      const mock = jest.spyOn(db, "addDepartment");
      mock.mockImplementation(() => {});
      db.addDepartment(testDepartment);

      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(testDepartment);
      mock.mockRestore();
    });

    it("addEmployee", () => {
      const db = new DB();
      const testInput = {
        firstName: "test" + Math.random(),
        lastName: "test" + Math.random(),
        roleId: 1,
        managerId: null,
      };
      const mock = jest.spyOn(db, "addEmployee");
      mock.mockImplementation(() => {});
      db.addEmployee(testInput.firstName, testInput.lastName, testInput.roleId, testInput.managerId);

      expect(mock).toBeCalledTimes(1);
      // Object.values produces an array of values, use spread operator to check each one
      expect(mock).toBeCalledWith(...Object.values(testInput));
      mock.mockRestore();
    });
  });
});
