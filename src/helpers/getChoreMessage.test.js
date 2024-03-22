const { getChoreMessage } = require("./getChoreMessage");

describe("getChoreMessage", () => {
  test("calling chore message with no params should let you know the chore wasn't found", () => {
    expect(getChoreMessage()).toBe("Chore not found");
  });

  test("calling chore message with a chore object should return a string", () => {
    const testChoreObject = {
      displayName: "test chore",
      description: "a chore for testing with",
    };
    expect(typeof getChoreMessage(testChoreObject)).toBe("string");
  });
});
