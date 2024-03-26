const {
  getAllChores,
  getCompletedChores,
  getIncompleteChores,
  getTodoChores,
  getChore,
} = require("./getChores");
const db = require("../services/db");
const { testChores, allTestChores } = require("../test/structs");
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
      db.getItem.mockReturnValue(testChores.incompleteChores[0]);
      const res = await getChore(testChores.incompleteChores[0].id);
      expect(res).toBe(testChores.incompleteChores[0]);
      expect(db.getItem.mock.calls.length).toBe(1);
    });
  });
  describe("getAllChores", () => {
    it("should return chores from the DB", async () => {
      db.scan.mockReturnValue(testChores.incompleteChores);
      const res = await getAllChores();
      expect(res).toBe(testChores.incompleteChores);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getCompletedChores", () => {
    it("should return completed chores from the DB", async () => {
      db.scan.mockReturnValue(allTestChores);
      const res = await getCompletedChores();
      expect(res).toEqual(testChores.completedChores);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getIncompleteChores", () => {
    it("should return incomplete chores from the DB", async () => {
      db.scan.mockReturnValue(allTestChores);
      const res = await getIncompleteChores();
      expect(res).toEqual(testChores.incompleteChores);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
  describe("getTodoChores", () => {
    it("should return incomplete chores from the DB", async () => {
      db.scan.mockReturnValue(allTestChores);
      const res = await getTodoChores();
      expect(res).toEqual(testChores.todoChores);
      expect(db.scan.mock.calls[0][0]).toBe(TABLES.CHORES);
    });
  });
});
