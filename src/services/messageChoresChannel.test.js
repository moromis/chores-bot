const { messageChoresChannel } = require("./messageChoresChannel");

describe("getChores", () => {
  it("should send a message to the channel given by the CHANNEL_ID env variable", async () => {
    const original = process.env.CHANNEL_ID;
    const testChannelId = "test-channel";
    process.env.CHANNEL_ID = testChannelId;
    const testMessage = "test";
    const sendSpy = jest.fn();
    const fetchSpy = jest.fn(() => ({
      send: sendSpy,
    }));
    const clientSpy = {
      channels: {
        fetch: fetchSpy,
      },
    };
    await messageChoresChannel(clientSpy, testMessage);
    expect(fetchSpy).toHaveBeenCalledWith(testChannelId);
    expect(sendSpy).toHaveBeenCalledWith(testMessage);
    process.env.CHANNEL_ID = original;
  });
});
