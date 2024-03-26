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
  it("should return random values without replacement till the given array is empty", () => {
    const testArray = [1, 2, 3];
    const removedElements = [];
    while (testArray.length > 0) {
      const removed = removeRandomFromList(testArray);
      expect(removedElements).not.toContain(removed);
      removedElements.push(removed);
    }
    expect(testArray.length).toEqual(0);
    expect(removedElements.length).toEqual(3);
  });
});
