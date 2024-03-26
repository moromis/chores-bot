const services = require("../../services/index.js");
const globalHandler = require("../handler.js");
const { printMonthlyScoreboard } = require("./printMonthlyScoreboard.js");

const data = {
  name: "scoreboard",
  type: 1,
  description: "get a scoreboard for the current month",
};

const _action = async () => {
  const allUsers = await services.getAllUsers();
  const sortedUsers = allUsers.sort(
    (u1, u2) => u2.numCycleChores - u1.numCycleChores,
  );

  const response = {
    content: printMonthlyScoreboard(sortedUsers),
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
