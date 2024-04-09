const { handler } = require("./weekly");
const { Client } = require("discord.js");
const services = require("../../../services");
const {
  testChores,
  getTestUsers,
  generateTodoChores,
  generateTestUsers,
} = require("../../../test-fixtures/fixtures");
const _ = require("lodash");

jest.mock("../../../services");
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

describe("weekly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should run", async () => {
    const testUsers = getTestUsers();
    const incompleteChores = testChores.getTestIncompleteChores();
    const todoChores = testChores.getTestTodoChores();
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    services.updateUsers.mockReturnValue(testUsers);
    services.getTodoChores.mockReturnValue(todoChores);
    await handler();
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.login).toHaveBeenCalledTimes(1);
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
    expect(services.messageChoresChannel.mock.calls.length).toBeGreaterThan(0);
  });
  it("should unassign completed chore if there's no more todo chores", async () => {
    const testUsers = getTestUsers();
    const incompleteChores = testChores.getTestIncompleteChores();
    const todoChores = testChores.getTestTodoChores();
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    services.updateUsers.mockReturnValue(testUsers.slice(0, todoChores.length));
    services.getTodoChores.mockReturnValueOnce([]).mockReturnValue(todoChores);
    await handler();
    expect(services.unassignCompletedChores).toHaveBeenCalled();
    expect(services.getTodoChores).toHaveBeenCalledTimes(2);
  });
  it("should unassign completed chores if there's too few chores", async () => {
    const testUsers = getTestUsers();
    const todoChores = testChores.getTestTodoChores();
    services.getIncompleteChores.mockReturnValue([]);
    services.updateUsers.mockReturnValue(testUsers);
    services.getTodoChores
      .mockReturnValueOnce(todoChores.slice(0, testUsers.length - 2))
      .mockReturnValue(todoChores);
    await handler();
    expect(services.unassignCompletedChores).toHaveBeenCalled();
    expect(services.getTodoChores).toHaveBeenCalledTimes(2);
  });
  it("should give a user with `extraPointage` defined more points", async () => {
    const testUsers = getTestUsers();
    const incompleteChores = testChores.getTestIncompleteChores();
    const todoChores = testChores.getTestTodoChores();
    const extraPointage = 1;
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    services.updateUsers.mockReturnValue([
      { ...testUsers[0], extraPointage },
      testUsers[1],
    ]);
    services.getTodoChores.mockReturnValue(todoChores);
    await handler();
    expect(services.db.batchWrite.mock.calls[1][1][0].numCycleChores).toBe(
      testUsers[0].numCycleChores + extraPointage,
    );
  });
  it("should assign each user as a reviewer exactly once", async () => {
    const numToTest = 1000;
    const testUsers = generateTestUsers(numToTest);
    const incompleteChores = testChores.getTestIncompleteChores();
    const todoChores = generateTodoChores(numToTest);
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    services.updateUsers.mockReturnValue(testUsers);
    services.getTodoChores.mockReturnValue(todoChores);
    await handler();
    expect(services.db.batchWrite.mock.calls.length).not.toBe(0);
    const writtenChores = services.db.batchWrite.mock.calls[0][1];
    expect(writtenChores.length).toBe(numToTest);
    expect(_.uniq(writtenChores.map((c) => c.reviewer)).length).toBe(numToTest);
  });
  it("should not assign a user as their own reviewer", async () => {
    const numToTest = 1000;
    const testUsers = generateTestUsers(numToTest);
    const incompleteChores = testChores.getTestIncompleteChores();
    const todoChores = generateTodoChores(numToTest);
    services.getIncompleteChores.mockReturnValue(incompleteChores);
    services.updateUsers.mockReturnValue(testUsers);
    services.getTodoChores.mockReturnValue(todoChores);
    await handler();
    expect(services.db.batchWrite.mock.calls.length).not.toBe(0);
    const writtenChores = services.db.batchWrite.mock.calls[0][1];
    expect(writtenChores.length).toBe(numToTest);
    const reviewerDoesNotEqualsUser = _.every(
      writtenChores.map((c) => c.reviewer != c.user),
    );
    expect(reviewerDoesNotEqualsUser).toBe(true);
  });
});
