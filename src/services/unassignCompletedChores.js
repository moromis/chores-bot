const { unassignChores } = require("./unassignChores");
const { getCompletedChores } = require("./getChores");

const unassignCompletedChores = async () => {
  const completedChores = await getCompletedChores();
  await unassignChores(completedChores);
};

module.exports = {
  unassignCompletedChores,
};
