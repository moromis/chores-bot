const { data, handler, _action } = require("./complete");
const globalHandler = require("../handler");
const { Client } = require("discord.js");
const { getTestBody, testChores, testUsers } = require("../../test/structs");
const strings = require("../../constants/strings");
const getChoreCompleteMessage = require("../../helpers/getChoreCompleteMessage");
const { CHORE_STATES } = require("../../constants/chores");
const services = require("../../services");
const { TABLES } = require("../../constants/tables");
const _ = require("lodash");

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
  test("if the user doesn't have an assigned chore the discord.js client should be\
  destroyed and a message should be returned indicating the user already has a chore", async () => {
    const res = await _action(getTestBody("1"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(strings.NO_ASSIGNED_CHORE);
  });
  test("if the user has a chore it should be marked as completed, and have no reviewer or user", async () => {
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    const res = await _action(getTestBody("1"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(getChoreCompleteMessage("1"));
    expect(services.db.put.mock.calls[0][0]).toBe(TABLES.CHORES);
    expect(services.db.put.mock.calls[0][1]).not.toHaveProperty("reviewer");
    expect(services.db.put.mock.calls[0][1]).not.toHaveProperty("user");
    expect(services.db.put.mock.calls[0][1].status).toBe(CHORE_STATES.COMPLETE);
  });
  test("if the user has a chore the user should be put in the DB\
  without a currentChore prop and with scores adjusted correctly", async () => {
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    services.getUser.mockReturnValue({
      ...testUsers[0],
      numCycleChores: 0,
      numAllTimeChores: 0,
    });
    const res = await _action(getTestBody(testUsers[0].id));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled(); // TODO: abstract this discord.js destroy check into a wrapper?
    expect(res.content).toBe(getChoreCompleteMessage(testUsers[0].id));
    expect(services.db.put.mock.calls[1][0]).toBe(TABLES.USERS);
    expect(services.db.put.mock.calls[1][1].id).toBe(testUsers[0].id);
    expect(services.db.put.mock.calls[1][1].numCycleChores).toBe(1);
    expect(services.db.put.mock.calls[1][1].numAllTimeChores).toBe(1);
    expect(services.db.put.mock.calls[1][1]).not.toHaveProperty("currentChore");
  });
  test("the user should have properly adjusted scores even if they don't have any beforehand", async () => {
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    services.getUser.mockReturnValue(
      _.omit(testUsers[0], ["numCycleChores", "numAllTimeChores"]),
    );
    await _action(getTestBody(testUsers[0].id));
    expect(services.db.put.mock.calls[1][1].numCycleChores).toBe(1);
    expect(services.db.put.mock.calls[1][1].numAllTimeChores).toBe(1);
  });
});
