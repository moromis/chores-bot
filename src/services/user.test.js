const { getAllUsers, getUser, updateUsers } = require("./user");
const db = require("../services/db");
const { getTestDiscordUsers, getTestUsers } = require("../test/structs");

jest.mock("../services/db");

describe("users", () => {
  const testDiscordUsers = getTestDiscordUsers();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const testUsers = getTestUsers();
      db.scan.mockReturnValue(testUsers);
      const res = await getAllUsers();
      expect(res).toEqual(testUsers);
      expect(db.scan.mock.calls.length).toBe(1);
    });
  });
  describe("updateUsers", () => {
    it("should filter out any users without desired roles", async () => {
      const testUsers = getTestUsers();
      db.scan.mockReturnValue(testUsers);
      const original = process.env.GUILD_ID;
      const testGuildId = "test-guild";
      process.env.GUILD_ID = testGuildId;
      const fetchSpy = jest.fn(() => testDiscordUsers);
      const testGuild = {
        members: {
          fetch: fetchSpy,
        },
      };
      const guildsSpy = jest.fn(() => testGuild);
      const testClient = {
        guilds: {
          resolve: guildsSpy,
        },
      };
      const res = await updateUsers(testClient);
      expect(guildsSpy.mock.calls[0][0]).toBe(testGuildId);
      expect(res.filter((u) => !u.inactive).length).toBe(testUsers.length - 1);
      expect(res.filter((u) => u.inactive).length).toBe(1);
      process.env.GUILD_ID = original;
    });
    it("should NOT write to the DB if there are no users", async () => {
      db.scan.mockReturnValue([]);
      const fetchSpy = jest.fn(() => []);
      const testGuild = {
        members: {
          fetch: fetchSpy,
        },
      };
      const guildsSpy = jest.fn(() => testGuild);
      const testClient = {
        guilds: {
          resolve: guildsSpy,
        },
      };
      await updateUsers(testClient);
      expect(db.batchWrite.mock.calls.length).toBe(0);
    });
    it("on first run it should get all discord members with the correct role", async () => {
      db.scan.mockReturnValue([]);
      const fetchSpy = jest.fn(() => testDiscordUsers);
      const testGuild = {
        members: {
          fetch: fetchSpy,
        },
      };
      const guildsSpy = jest.fn(() => testGuild);
      const testClient = {
        guilds: {
          resolve: guildsSpy,
        },
      };
      const res = await updateUsers(testClient);
      expect(res.length).toBe(testDiscordUsers.length - 1);
      expect(db.batchWrite.mock.calls.length).toBe(1);
    });
  });
  it("should write to the DB if there are users", async () => {
    const fetchSpy = jest.fn(() => testDiscordUsers);
    const testGuild = {
      members: {
        fetch: fetchSpy,
      },
    };
    const guildsSpy = jest.fn(() => testGuild);
    const testClient = {
      guilds: {
        resolve: guildsSpy,
      },
    };
    await updateUsers(testClient);
    expect(db.batchWrite.mock.calls.length).toBe(1);
  });
  it("should add numCycleChores, numAllTimeChores, and inactive to new users (ones that aren't in the db)", async () => {
    db.scan.mockReturnValue([]);
    const fetchSpy = jest.fn(() => testDiscordUsers);
    const testGuild = {
      members: {
        fetch: fetchSpy,
      },
    };
    const guildsSpy = jest.fn(() => testGuild);
    const testClient = {
      guilds: {
        resolve: guildsSpy,
      },
    };
    const users = await updateUsers(testClient);
    expect(db.batchWrite.mock.calls[0][1]).toEqual(users);
    users.forEach((u) => {
      expect(u).toHaveProperty("numCycleChores");
      expect(u).toHaveProperty("numAllTimeChores");
      expect(u).toHaveProperty("inactive");
    });
  });
  it("should properly mark inactive useres", async () => {
    const testUsers = getTestUsers();
    db.scan.mockReturnValue(testUsers);
    const fetchSpy = jest.fn(() => []);
    const testGuild = {
      members: {
        fetch: fetchSpy,
      },
    };
    const guildsSpy = jest.fn(() => testGuild);
    const testClient = {
      guilds: {
        resolve: guildsSpy,
      },
    };
    const users = await updateUsers(testClient);
    users.forEach((u) => {
      expect(u.inactive).toBe(true);
    });
  });
  describe("getUser", () => {
    it("should return null if not given a userId", async () => {
      const testUsers = getTestUsers();
      db.getItem.mockReturnValue(testUsers[0]);
      const res = await getUser();
      expect(res).toEqual(null);
    });
    it("should get the requested user", async () => {
      const testUsers = getTestUsers();
      db.getItem.mockReturnValue(testUsers[0]);
      const res = await getUser(testUsers[0].id);
      expect(res).toEqual(testUsers[0]);
    });
  });
});
