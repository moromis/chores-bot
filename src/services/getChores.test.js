const {
  getAllChores,
  getCompletedChores,
  getIncompleteChores,
  getTodoChores,
  getChore,
} = require("./getChores");
const db = require("../services/db");
const { testChores, getAllTestChores } = require("../test/structs");
const { TABLES } = require("../constants/tables");

jest.mock("../services/db");

describe("getChores", () => {
  describe("getChore", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should return null if not given a chore id", async () => {
      const res = await getChore();
      expect(res).toBeNull();
    });
    it("should return a chore from the db if given a choreId", async () => {
      const incompleteChores = testChores.getTestIncompleteChores();
      db.getItem.mockReturnValue(incompleteChores[0]);
      const res = await getChore(incompleteChores[0].id);
      const incompleteChoresResult = testChores.getTestIncompleteChores();
      expect(res).toEqual(incompleteChoresResult[0]);
      expect(db.getItem.mock.calls.length).toBe(1);
    });
  });
  describe("getAllChores", () => {
    it("should return chores from the DB", async () => {
      const incompleteChores = testChores.getTestIncompleteChores();
      db.scan.mockReturnValue(incompleteChores);
      const res = await getAllChores();
      const incompleteChoresResult = testChores.getTestIncompleteChores();
      expect(res).toEqual(incompleteChoresResult);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getCompletedChores", () => {
    it("should return completed chores from the DB", async () => {
      const allTestChores = getAllTestChores();
      db.scan.mockReturnValue(allTestChores);
      const res = await getCompletedChores();
      const completedChoresResult = testChores.getTestCompletedChores();
      expect(res).toEqual(completedChoresResult);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getIncompleteChores", () => {
    it("should return incomplete chores from the DB", async () => {
      const allTestChores = getAllTestChores();
      db.scan.mockReturnValue(allTestChores);
      const res = await getIncompleteChores();
      const incompleteChoresResult = testChores.getTestIncompleteChores();
      expect(res).toEqual(incompleteChoresResult);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getTodoChores", () => {
    it("should return incomplete chores from the DB", async () => {
      const allTestChores = getAllTestChores();
      db.scan.mockReturnValue(allTestChores);
      const res = await getTodoChores();
      const todoChoresResult = testChores.getTestTodoChores();
      expect(res).toEqual(todoChoresResult);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
});
