const db = require("./db");
const { CHORE_STATES } = require("../constants/chores");
const { TABLES } = require("../constants/tables");
const _ = require("lodash");

const unassignChores = async (chores) => {
  const newUnassignedChores = chores.map((chore) => ({
    ..._.omit(chore, ["user", "reviewer"]),
    status: CHORE_STATES.TODO,
  }));
  await db.batchWrite(TABLES.CHORES, newUnassignedChores);
};

module.exports = {
  unassignChores,
};
