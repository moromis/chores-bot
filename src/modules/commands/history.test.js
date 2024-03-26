const { data, handler, _action } = require("./history");
const globalHandler = require("../handler");
const { printHistory } = require("./printHistory");

jest.mock("../handler", () => jest.fn(() => {}));

const users = [
  { displayName: "user1", numAllTimeChores: 5 },
  { displayName: "user2", numAllTimeChores: 1 },
  { displayName: "user3", numAllTimeChores: 4 },
];

const sortedUsers = [
  { displayName: "user1", numAllTimeChores: 5 },
  { displayName: "user3", numAllTimeChores: 4 },
  { displayName: "user2", numAllTimeChores: 1 },
];

jest.mock("../../services", () => ({
  getAllUsers: () => users,
}));

describe("history", () => {
  test("the data should have type === 1, and should have a name and description", () => {
    expect(data).toHaveProperty("type");
    expect(data.type).toBe(1);
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("description");
  });
  test("when called, the handler should invoke the global handler", () => {
    handler();
    expect(globalHandler).toHaveBeenCalled();
  });
  test("when called with an event, the handler should invoke the global handler with that event", () => {
    const testEvent = "test";
    handler(testEvent);
    expect(globalHandler).toHaveBeenCalledWith(testEvent, expect.anything());
  });
  test("history should print all users historical scores, in order from largest to smallest", async () => {
    const res = await _action();
    expect(res).toHaveProperty("content");
    expect(res.content).toMatch(printHistory(sortedUsers));
  });
});
