const { dmUser } = require("./dmUser");

describe("dmUser", () => {
  const sendSpyBot = jest.fn(() => {});
  const sendSpyHuman = jest.fn(() => {});
  const fetchSpyBot = jest.fn(() => ({ bot: true, send: sendSpyBot }));
  const fetchSpyHuman = jest.fn(() => ({ bot: false, send: sendSpyHuman }));
  const testClient = (fetchSpy) => ({
    users: {
      fetch: fetchSpy,
    },
  });
  const testMessage = "test";

  beforeEach(() => {
    jest.clearAllMocks;
  });

  it("should do nothing if not given a userId", () => {
    dmUser(testClient(fetchSpyHuman), undefined, "test");
    expect(fetchSpyHuman).not.toHaveBeenCalled();
    expect(fetchSpyHuman).not.toHaveBeenCalled();
  });

  it("should fetch users given a userId", () => {
    dmUser(testClient(fetchSpyHuman), "asdf", testMessage);
    expect(fetchSpyHuman).toHaveBeenCalledTimes(1);
  });

  it("should send a message if the user is not a bot", () => {
    dmUser(testClient(fetchSpyHuman), "asdf", testMessage);
    expect(sendSpyHuman).toHaveBeenCalledWith(testMessage);
  });

  it("should not send a message if the user is a bot", () => {
    dmUser(testClient(fetchSpyBot), "asdf", "double test");
    expect(sendSpyBot).not.toHaveBeenCalled();
  });
});
