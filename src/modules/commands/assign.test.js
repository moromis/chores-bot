const { data, handler, _action } = require("./assign");
const globalHandler = require("../handler");
const { Client } = require("discord.js");
const services = require("../../services");
const strings = require("../../constants/strings");
const { TABLES } = require("../../constants/tables");
const { CHORE_STATES } = require("../../constants/chores");
const {
  testChores,
  getTestBody,
  getTestUsers,
} = require("../../test-fixtures/fixtures");

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

describe("assign", () => {
  beforeAll(() => {
    services.updateUsers.mockReturnValue(getTestUsers());
  });
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
  test("if the user already has a chore, the discord.js client should be\
  destroyed and a message should be returned indicating the user already has a chore", async () => {
    const todoChores = testChores.getTestTodoChores();
    const incompleteChores = testChores.getTestIncompleteChores();
    services.getTodoChores.mockReturnValue(todoChores);
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    const res = await _action(getTestBody("1"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(strings.USER_HAS_CHORE);
  });
  test("if there aren't any available reviewers, a message should return that fact", async () => {
    const incompleteChoresNoReviewersAvailable =
      testChores.getTestIncompleteChoresNoReviewersAvailable();
    services.getTodoChores.mockReturnValue([]);
    services.getIncompleteChores.mockReturnValue(
      incompleteChoresNoReviewersAvailable,
    );
    const res = await _action(getTestBody("2"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(res.content).toBe(strings.NO_REVIEWERS);
  });
  test("if the user doesn't have a chore, one should be assigned to them", async () => {
    const todoChores = testChores.getTestTodoChores();
    const incompleteChores = testChores.getTestIncompleteChores();
    services.getTodoChores.mockReturnValue(todoChores);
    services.getIncompleteChores.mockReturnValueOnce(incompleteChores);
    const res = await _action(getTestBody("2"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    // should write the new chore
    expect(services.db.put.mock.calls[0][0]).toBe(TABLES.CHORES);
    expect(services.db.put.mock.calls[0][1]).toHaveProperty("reviewer");
    expect(services.db.put.mock.calls[0][1]).toHaveProperty("user");
    expect(services.db.put.mock.calls[0][1].status).toBe(CHORE_STATES.ASSIGNED);
    // then it should write the user
    expect(services.db.put.mock.calls[1][0]).toBe(TABLES.USERS);
    expect(services.db.put.mock.calls[1][1].id).toBe("2");
    expect(services.db.put.mock.calls[1][1]).toHaveProperty("currentChore");
  });
  test("if something goes wrong getting a new chore, the user should be notified, and nothing should be written to the db", async () => {
    const incompleteChores = testChores.getTestIncompleteChores();
    services.getTodoChores.mockReturnValue([]);
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    const res = await _action(getTestBody("2"));
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalled();
    expect(services.db.put.mock.calls.length).toBe(0);
    expect(res.content).toBe(strings.UNABLE_TO_ASSIGN_CHORE);
  });
});
