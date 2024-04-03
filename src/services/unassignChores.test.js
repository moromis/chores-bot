const {
  getAllChores,
  getCompletedChores,
  getIncompleteChores,
  getTodoChores,
  getChore,
} = require("./getChores");
const db = require("../services/db");
const { testChores } = require("../test-fixtures/fixtures");
const { TABLES } = require("../constants/tables");
const { unassignChores } = require("./unassignChores");
const { CHORE_STATES } = require("../constants/chores");

jest.mock("../services/db");

describe("unassignChores", () => {
  it("should take in chores and write them all with no user, reviewer, and status === CHORE_STATES.TODO", async () => {
    const incompleteChores = testChores.getTestIncompleteChores();
    await unassignChores(incompleteChores);
    expect(db.batchWrite.mock.calls[0][0]).toBe(TABLES.CHORES);
    db.batchWrite.mock.calls[0][1].map((chore) => {
      expect(chore).not.toHaveProperty("reviewer");
      expect(chore).not.toHaveProperty("user");
      expect(chore.status).toBe(CHORE_STATES.TODO);
    });
  });
});
