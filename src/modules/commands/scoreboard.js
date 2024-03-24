const { user } = require("../../services");
const globalHandler = require("../handler.js").globalHandler;

const data = {
  name: "scoreboard",
  type: 1,
  description: "get a scoreboard for the current month",
};

const _action = async () => {
  const allUsers = await user.getAllUsers();
  const allScores = allUsers
    .sort((u1, u2) => u2.numCycleChores - u1.numCycleChores)
    .map((u) => `${u.displayName}: ${u.numCycleChores}`);

  const response = {
    content: `## Monthly Scoreboard\n${allScores.join("\n")}`,
  };

  return response;
};

function handler(event) {
  globalHandler(event, _action);
}

module.exports = {
  data,
  handler,
  _action,
};
