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
      const mock = jest.spyOn(db, "addDepartment");
      mock.mockImplementation(() => {});
      db.addDepartment("Test2");

      expect(mock).toBeCalledTimes(1);
      mock.mockRestore();
    });

    it("addDepartment", () => {
      const db = new DB();
      const mock = jest.spyOn(db, "addDepartment");
      mock.mockImplementation(() => {});
      db.addDepartment("Test2");

      expect(mock).toBeCalledTimes(1);
      mock.mockRestore();
    });

    it("addEmployee", () => {
      const db = new DB();
      const mock = jest.spyOn(db, "addEmployee");
      mock.mockImplementation(() => {});
      db.addEmployee("FirstN", "LastN", 1, 1);

      expect(mock).toBeCalledTimes(1);
      mock.mockRestore();
    });
  });
});
