const services = require("../../services");
const globalHandler = require("../handler.js");
const { printHistory } = require("./printHistory.js");

const data = {
  name: "history",
  type: 1,
  description: "get a scoreboard of all history",
};

const _action = async () => {
  const allUsers = await services.getAllUsers();
  const sortedUsers = allUsers.sort(
    (u1, u2) => u2.numAllTimeChores - u1.numAllTimeChores,
  );

  const response = {
    content: printHistory(sortedUsers),
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
