const Employee = require("../lib/Employee");

describe("Employee class", () => {
  describe("Initilization", () => {
    it("Should create an object when initialized", () => {
      const employee = new Employee("First", "Last", "QA", null);

      expect(typeof employee).toBe("object");
      expect(employee instanceof Employee).toBe(true);
    });
  });
});
