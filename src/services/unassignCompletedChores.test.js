const { getCompletedChores } = require("./getChores");
const { testChores } = require("../test/structs");
const { unassignChores } = require("./unassignChores");
const { unassignCompletedChores } = require("./unassignCompletedChores");

jest.mock("./getChores");
jest.mock("./unassignChores");

describe("unassignCompletedChores", () => {
  it("should call getCompletedChores and unassignChores", async () => {
    getCompletedChores.mockReturnValue(testChores.completedChores);
    await unassignCompletedChores();
    expect(getCompletedChores.mock.calls.length).toBe(1);
    expect(unassignChores.mock.calls[0][0]).toEqual(testChores.completedChores);
  });
});
