const { data, handler, _action } = require("./complete");
const globalHandler = require("../handler");
const { Client } = require("discord.js");
const { getTestBody } = require("../../test/structs");
const strings = require("../../constants/strings");

jest.mock("../handler", () => jest.fn(() => {}));
jest.mock("../../services");
jest.mock("discord.js", () => ({
  Client: jest.fn().mockImplementation(() => ({
    login: jest.fn(() => {}),
    destroy: jest.fn(() => {}),
  })),
  GatewayIntentBits: {
    Guilds: "guilds",
    GuildMembers: "guild-members",
  },
}));

describe("complete", () => {
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
  test("if the user doesn't have an assigned chore the discord.js client should be\
  destroyed and a message should be returned indicating the user already has a chore", async () => {
    const res = await _action(getTestBody("1"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(strings.NO_ASSIGNED_CHORE);
  });
});
