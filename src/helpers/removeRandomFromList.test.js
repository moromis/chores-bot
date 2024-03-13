const { removeRandomFromList } = require("./removeRandomFromList");

describe("removeRandomFromList", () => {
  it("should throw an error when called without any params", () => {
    expect(() => removeRandomFromList()).toThrow();
  });
  it("should throw an error when called with an empty list", () => {
    expect(removeRandomFromList([])).toBeNull();
  });
  it("should return a random value when given a list of values", () => {
    expect(typeof removeRandomFromList([1, 2, 3])).toBe("number");
  });
});
