const { data, handler, _action } = require("./chore");
const globalHandler = require("../handler");
const { Client } = require("discord.js");
const services = require("../../services");
const strings = require("../../constants/strings");
const {
  testChores,
  getTestBody,
  getTestUsers,
} = require("../../test-fixtures/fixtures");
const getCurrentChoreMessage = require("../../helpers/getCurrentChoreMessage");

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
jest.mock("../../helpers/getChoreMessage");

describe("chore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
  test("if the user's chore can't be found the discord.js client should be\
  destroyed and a message should be returned indicating the user might not have a chore", async () => {
    const testUsers = getTestUsers();
    services.getUser.mockReturnValue(testUsers[0]);
    const res = await _action(getTestBody(testUsers[0].id));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(strings.MAYBE_NO_CHORE);
  });
  test("if the user does have a chore, the user should be DMed with their chore details, and the original message should be deleted", async () => {
    const testUsers = getTestUsers();
    const incompleteChores = testChores.getTestIncompleteChores();
    services.getChore.mockReturnValue(incompleteChores[0]);
    services.getUser.mockReturnValue(testUsers[0]);
    const res = await _action(getTestBody(testUsers[0].id));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(services.dmUser.mock.calls).toHaveLength(1);
    const incompleteChoresResult = testChores.getTestIncompleteChores();
    expect(services.dmUser.mock.calls[0][2]).toBe(
      getCurrentChoreMessage(incompleteChoresResult[0]),
    );
    expect(res.content).toBe(undefined);
    expect(res.delete).toBe(true);
  });
});
