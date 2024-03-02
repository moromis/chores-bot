import services from ".";
import { CHORE_STATES } from "../../../constants/chores";
import { TABLES } from "../../../constants/tables";

const _getChoresByState = async (state) => {
  // get all chores
  const allChores = getAllChores();

  // filter chores, return
  return allChores.filter((chore) => chore.status === state);
};

const getAllChores = async () => {
  // get all chores from DynamoDB
  const chores = services.db.scan(TABLES.CHORES);
  return chores;
};

const getCompletedChores = async () => {
  return await _getChoresByState(CHORE_STATES.COMPLETE);
};

const getIncompleteChores = async () => {
  return await _getChoresByState(CHORE_STATES.ASSIGNED);
};

const getTodoChores = async () => {
  return await _getChoresByState(CHORE_STATES.TODO);
};

export { getAllChores, getCompletedChores, getIncompleteChores, getTodoChores };
