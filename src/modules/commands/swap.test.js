const { data, handler, _action } = require("./swap");
const globalHandler = require("../handler");
const { Client } = require("discord.js");
const { getTestBody, testChores, testUsers } = require("../../test/structs");
const strings = require("../../constants/strings");
const getChoreCompleteMessage = require("../../helpers/getChoreCompleteMessage");
const { CHORE_STATES } = require("../../constants/chores");
const services = require("../../services");
const { TABLES } = require("../../constants/tables");
const _ = require("lodash");
const { removeRandomFromList } = require("../../helpers/removeRandomFromList");
const getChoreAssignedMessage = require("../../helpers/getChoreAssignedMessage");

jest.mock("../handler", () => jest.fn(() => {}));
jest.mock("../../services");
jest.mock("../../helpers/removeRandomFromList");

describe("swap", () => {
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
  test("if the user doesn't have an assigned chore, the command should let them know", async () => {
    services.getChore.mockReturnValue(null);
    services.getUser.mockReturnValue(testUsers[0]);
    const res = await _action(getTestBody("1"));
    expect(res.content).toBe(strings.NO_ASSIGNED_CHORE);
  });
  test("if the user doesn't have a chore the user should be put in the DB\
  without a currentChore prop and with scores adjusted correctly", async () => {
    removeRandomFromList.mockReturnValue(testChores.incompleteChores[1]);
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    services.getUser.mockReturnValue({
      ...testUsers[0],
      numCycleChores: 0,
      numAllTimeChores: 0,
    });
    const res = await _action(getTestBody(testUsers[0].id));
    expect(res.content).toBe(
      getChoreAssignedMessage(testUsers[0].id, undefined),
    );
    expect(services.db.put.mock.calls[0][0]).toBe(TABLES.USERS);
    expect(services.db.put.mock.calls[0][1].id).toBe(testUsers[0].id);
    expect(services.db.put.mock.calls[0][1].currentChore).toBe(
      testChores.incompleteChores[1].id,
    );
  });
  test("both the old chore and the new one should get properly written to the DB", async () => {
    removeRandomFromList.mockReturnValue(testChores.incompleteChores[1]);
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    services.getUser.mockReturnValue(
      _.omit(testUsers[0], ["numCycleChores", "numAllTimeChores"]),
    );
    await _action(getTestBody(testUsers[0].id));
    expect(services.db.batchWrite.mock.calls[0][0]).toBe(TABLES.CHORES);
    expect(services.db.batchWrite.mock.calls[0][1][0].id).toBe(
      testChores.incompleteChores[1].id,
    );
    expect(services.db.batchWrite.mock.calls[0][1][0].status).toBe(
      CHORE_STATES.ASSIGNED,
    );
    expect(services.db.batchWrite.mock.calls[0][1][0]).toHaveProperty(
      "reviewer",
    );
    expect(services.db.batchWrite.mock.calls[0][1][0]).toHaveProperty("user");
    expect(services.db.batchWrite.mock.calls[0][1][1].id).toBe(
      testChores.incompleteChores[0].id,
    );
    expect(services.db.batchWrite.mock.calls[0][1][1].status).toBe(
      CHORE_STATES.TODO,
    );
    expect(services.db.batchWrite.mock.calls[0][1][1]).not.toHaveProperty(
      "reviewer",
    );
    expect(services.db.batchWrite.mock.calls[0][1][1]).not.toHaveProperty(
      "user",
    );
  });
  test("if no new chore is given, a message should be returned to\
  indicate the command failed, and no DB operations should occur", async () => {
    removeRandomFromList.mockReturnValue(null);
    services.getChore.mockReturnValue(testChores.incompleteChores[0]);
    services.getUser.mockReturnValue(
      _.omit(testUsers[0], ["numCycleChores", "numAllTimeChores"]),
    );
    const res = await _action(getTestBody(testUsers[0].id));
    expect(services.db.put.mock.calls.length).toBe(0);
    expect(services.db.batchWrite.mock.calls.length).toBe(0);
    expect(res.content).toBe(strings.SWAP_FAILED);
  });
});
