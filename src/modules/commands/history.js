const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const { dmUser } = require("../../services/dmUser.js");
const { getAllChores } = require("../../services/getChores.js");
const _ = require("lodash");
const { Client, GatewayIntentBits } = require("discord.js");
const { getAllUsers } = require("../../services/index.js");

const globalHandler = require("../handler.js").globalHandler;
const db = require("../../services/index.js").db;

const data = {
  name: "history",
  type: 1,
  description: "get a scoreboard of all history",
};

const _action = async () => {
  const allUsers = await getAllUsers();
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
