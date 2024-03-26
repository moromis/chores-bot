const { handler } = require("./daily");
const { Client } = require("discord.js");
const services = require("../../../services");
const { testChores } = require("../../../test/structs");
const {
  getDMReminderMessage,
} = require("../../../helpers/getDMReminderMessage");

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
jest.mock("../../../helpers/getDMReminderMessage");

describe("daily", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should get all incomplete chores", async () => {
    services.getIncompleteChores.mockReturnValue([]);
    await handler();
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.login).toHaveBeenCalledTimes(1);
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
  });
  it("should dm all users to remind them of their chore", async () => {
    services.getIncompleteChores.mockReturnValue(testChores.incompleteChores);
    await handler();
    expect(Client).toHaveBeenCalled();
    expect(Client.mock.results[0].value.login).toHaveBeenCalledTimes(1);
    expect(Client.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
    expect(services.dmUser.mock.calls.length).toBe(
      testChores.incompleteChores.length,
    );
    expect(getDMReminderMessage.mock.calls.length).toBe(
      testChores.incompleteChores.length,
    );
  });
  it("should not dm users that have already done their chore", async () => {
    services.getIncompleteChores.mockReturnValue(
      testChores.incompleteChores.slice(1),
    );
    await handler();
    expect(services.dmUser.mock.calls.length).toBe(
      testChores.incompleteChores.length - 1,
    );
    expect(getDMReminderMessage.mock.calls.length).toBe(
      testChores.incompleteChores.length - 1,
    );
  });
});
