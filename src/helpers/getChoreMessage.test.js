const { getChoreMessage } = require("./getChoreMessage");

describe("getChoreMessage", () => {
  test("calling chore message with no params should throw an error", () => {
    expect(() => getChoreMessage()).toThrow();
  });

  test("calling chore message with a chore object should return a string", () => {
    const testChoreObject = {
      displayName: "test chore",
      description: "a chore for testing with",
    };
    expect(typeof getChoreMessage(testChoreObject)).toBe("string");
  });
});
