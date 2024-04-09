const { CHORE_STATES } = require("../constants/chores");
const { CHORE_ROLE, GARBAGE_ROLE } = require("../constants/roles");
const { cloneDeep } = require("lodash");

const testDiscordUsers = [
  {
    id: "1",
    displayName: "user1",
    roles: { cache: [{ name: CHORE_ROLE }, { name: GARBAGE_ROLE }] },
  },
  { id: "2", displayName: "user2", roles: { cache: [{ name: GARBAGE_ROLE }] } },
  { id: "3", displayName: "user3", roles: { cache: [{ name: CHORE_ROLE }] } },
  { id: "4", displayName: "user4", roles: { cache: [] } },
];

const getTestDiscordUsers = () => cloneDeep(testDiscordUsers);

const testUsers = [
  { id: "1", displayName: "user1", numCycleChores: 5, currentChore: "test3" },
  { id: "2", displayName: "user2", numCycleChores: 1 },
  { id: "3", displayName: "user3", numCycleChores: 4, currentChore: "test4" },
  { id: "4", displayName: "user4", numCycleChores: 6 },
];

const getTestUsers = () => cloneDeep(testUsers);

const testUsersSortedByScoreDesc = [
  { id: "4", displayName: "user4", numCycleChores: 6 },
  { id: "1", displayName: "user1", numCycleChores: 5, currentChore: "test3" },
  { id: "3", displayName: "user3", numCycleChores: 4, currentChore: "test4" },
  { id: "2", displayName: "user2", numCycleChores: 1 },
];

const generateTestUsers = (numToGenerate) => {
  const users = [];
  for (let i = 0; i < numToGenerate; i++) {
    users.push({
      id: `${i}`,
      displayName: `user${i}`,
    });
  }
  return users;
};

const getTestUsersSortedByScoreDesc = () =>
  cloneDeep(testUsersSortedByScoreDesc);

const todoChores = [
  { id: "test", status: CHORE_STATES.TODO },
  { id: "test2", status: CHORE_STATES.TODO },
];

const generateTodoChores = (numToGenerate) => {
  const chores = [];
  for (let i = 0; i < numToGenerate; i++) {
    chores.push({
      id: `test${i}`,
      status: CHORE_STATES.TODO,
    });
  }
  return chores;
};

const incompleteChores = [
  { id: "test3", status: CHORE_STATES.ASSIGNED, reviewer: "3", user: "1" },
  { id: "test4", status: CHORE_STATES.ASSIGNED, reviewer: "2", user: "3" },
];

const completedChores = [
  { id: "test5", status: CHORE_STATES.COMPLETE, reviewer: "3", user: "1" },
  { id: "test6", status: CHORE_STATES.COMPLETE, reviewer: "2", user: "3" },
];

const incompleteChoresNoReviewersAvailable = [
  { id: "test", status: CHORE_STATES.ASSIGNED, reviewer: "1", user: "4" },
  { id: "test2", status: CHORE_STATES.ASSIGNED, reviewer: "4", user: "2" },
  { id: "test3", status: CHORE_STATES.ASSIGNED, reviewer: "3", user: "1" },
  { id: "test4", status: CHORE_STATES.ASSIGNED, reviewer: "2", user: "3" },
];

const testChores = {
  getTestTodoChores: () => cloneDeep(todoChores),
  getTestIncompleteChores: () => cloneDeep(incompleteChores),
  getTestCompletedChores: () => cloneDeep(completedChores),
  getTestIncompleteChoresNoReviewersAvailable: () =>
    cloneDeep(incompleteChoresNoReviewersAvailable),
};

const allTestChores = [...todoChores, ...incompleteChores, ...completedChores];

const getAllTestChores = () => cloneDeep(allTestChores);

const getTestBody = (userId) => ({
  member: {
    user: {
      id: userId,
    },
  },
});

module.exports = {
  getTestUsers,
  testChores,
  getTestUsersSortedByScoreDesc,
  getTestBody,
  getAllTestChores,
  getTestDiscordUsers,
  generateTodoChores,
  generateTestUsers,
};
