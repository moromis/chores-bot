const db = require("./db");
const CHORE_STATES = require("../constants/chores").CHORE_STATES;
const TABLES = require("../constants/tables").TABLES;

const _getChoresByState = async (state) => {
  // get all chores
  const allChores = await getAllChores();

  // filter chores, return
  return allChores.filter((chore) => chore.status === state);
};

const getChore = async (choreId) => {
  if (!choreId) return null;
  // get all chores from DynamoDB
  const chore = await db.getItem(TABLES.CHORES, choreId);
  return chore;
};

const getAllChores = async () => {
  // get all chores from DynamoDB
  const chores = await db.scan(TABLES.CHORES);
  return chores;
};

const getCompletedChores = async () => {
  return await _getChoresByState(CHORE_STATES.COMPLETE);
};

const getIncompleteChores = async () => {
  const result = await _getChoresByState(CHORE_STATES.ASSIGNED);
  return result;
};

const getTodoChores = async () => {
  return await _getChoresByState(CHORE_STATES.TODO);
};

module.exports = {
  getAllChores,
  getCompletedChores,
  getIncompleteChores,
  getTodoChores,
  getChore,
};
