const Department = require("../lib/Department");

describe("Department class tests", () => {
  describe("Initialization", () => {
    it("Should create an object when initialized", () => {
      const department = new Department("Test");

      expect(typeof department).toBe("object");
      expect(department instanceof Department).toBe(true);
    });
  });
});
