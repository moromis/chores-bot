const strings = require("../constants/strings");
const { getChoreMessage } = require("./getChoreMessage");
const { getDMReminderMessage } = require("./getDMReminderMessage");

jest.mock("./getChoreMessage");

describe("getDMReminderMessage", () => {
  it("should use getChoreMessage to compose its message", () => {
    getDMReminderMessage();
    expect(getChoreMessage).toHaveBeenCalled();
  });
  it("should let you know this is the last day if 0 days is passed", () => {
    const message = getDMReminderMessage(0);
    expect(message).toContain(strings.LAST_DAY);
  });
});
