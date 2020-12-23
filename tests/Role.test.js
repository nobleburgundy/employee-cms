const Role = require("../lib/Role");

describe("Role class", () => {
  describe("Initilization", () => {
    it("Should create an object when initialized", () => {
      const role = new Role("Test", 100000);

      expect(typeof role).toBe("object");
      expect(role instanceof Role).toBe(true);
    });
  });
});
