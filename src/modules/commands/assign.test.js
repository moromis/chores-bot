const { data, handler, _action } = require("./assign");
const globalHandler = require("../handler");

// const globalHandlerSpy = jest.fn(() => {});
jest.mock("../handler", () => jest.fn(() => {}));
// jest.mock("discord.js", () => jest.fn(() => ({
//   client:
// })));

describe("assign", () => {
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
  // test("", () => {
  //   const testEvent = "test";
  //   handler(testEvent);
  //   expect(globalHandler).toHaveBeenCalledWith(testEvent, expect.anything());
  // });
});
