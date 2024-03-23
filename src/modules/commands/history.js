const { user } = require("../../services/index.js");
const globalHandler = require("../handler.js").globalHandler;

const data = {
  name: "history",
  type: 1,
  description: "get a scoreboard of all history",
};

const _action = async () => {
  const allUsers = await user.getAllUsers();
  const allScores = allUsers
    .sort((u1, u2) => u2.numAllTimeChores - u1.numAllTimeChores)
    .map((u) => `${u.displayName}: ${u.numAllTimeChores}`);

  let response = {
    content: `## History\n${allScores.join("\n")}`,
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
