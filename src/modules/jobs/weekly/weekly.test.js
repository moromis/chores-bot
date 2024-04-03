const { handler } = require("./weekly");
const { Client } = require("discord.js");
const services = require("../../../services");
const { testChores, getTestUsers } = require("../../../test/structs");

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
});
