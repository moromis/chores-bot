const { handler } = require("./monthly");
const { Client } = require("discord.js");
const services = require("../../../services");
const {
  testChores,
  testUsers,
  testUsersSortedByScoreDesc,
} = require("../../../test/structs");
const {
  getDMReminderMessage,
} = require("../../../helpers/getDMReminderMessage");
const getMonthEndMessage = require("../../../helpers/getMonthEndMessage");

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

describe("monthly", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should message the chores channel if there's users", async () => {
    services.updateUsers.mockReturnValue(testUsersSortedByScoreDesc);
    await handler();
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.login).toHaveBeenCalledTimes(1);
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
    expect(services.messageChoresChannel.mock.calls.length).toBe(1);
    expect(services.messageChoresChannel.mock.calls[0][1]).toBe(
      getMonthEndMessage(testUsersSortedByScoreDesc),
    );
  });
  it("should not message the chores channel if there's no users", async () => {
    services.updateUsers.mockReturnValue(null);
    await handler();
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.login).toHaveBeenCalledTimes(1);
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
    expect(services.messageChoresChannel.mock.calls.length).toBe(0);
  });
  it("should push updated users to the DB, resetting numCycleChores", async () => {
    services.updateUsers.mockReturnValue(testUsersSortedByScoreDesc);
    await handler();
    expect(services.db.batchWrite.mock.calls.length).toBe(1);
    services.db.batchWrite.mock.calls[0][1].map((u) => {
      expect(u.numCycleChores).toBe(0);
    });
  });
});
