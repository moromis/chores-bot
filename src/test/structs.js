const testUsers = [
  { id: "1", displayName: "user1", numCycleChores: 5, currentChore: "test3" },
  { id: "2", displayName: "user2", numCycleChores: 1 },
  { id: "3", displayName: "user3", numCycleChores: 4, currentChore: "test4" },
  { id: "4", displayName: "user4", numCycleChores: 6 },
];

const testUsersSortedByScoreDesc = [
  { id: "4", displayName: "user4", numCycleChores: 6 },
  { id: "1", displayName: "user1", numCycleChores: 5, currentChore: "test3" },
  { id: "3", displayName: "user3", numCycleChores: 4, currentChore: "test4" },
  { id: "2", displayName: "user2", numCycleChores: 1 },
];

const testChores = {
  todoChores: [
    { id: "test", status: 0 },
    { id: "test2", status: 0 },
  ],
  incompleteChores: [
    { id: "test3", status: 1, reviewer: "3", user: "1" },
    { id: "test4", status: 1, reviewer: "2", user: "3" },
  ],
  incompleteChoresNoReviewersAvailable: [
    { id: "test", status: 1, reviewer: "1", user: "4" },
    { id: "test2", status: 1, reviewer: "4", user: "2" },
    { id: "test3", status: 1, reviewer: "3", user: "1" },
    { id: "test4", status: 1, reviewer: "2", user: "3" },
  ],
};

const getTestBody = (userId) => ({
  member: {
    user: {
      id: userId,
    },
  },
});

module.exports = {
  testUsers,
  testChores,
  testUsersSortedByScoreDesc,
  getTestBody,
};
