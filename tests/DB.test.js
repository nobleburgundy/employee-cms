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
});
