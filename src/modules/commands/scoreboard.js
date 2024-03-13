const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const { dmUser } = require("../../services/dmUser.js");
const { getAllChores } = require("../../services/getChores.js");
const _ = require("lodash");
const { Client, GatewayIntentBits } = require("discord.js");
const { getAllUsers } = require("../../services");

const globalHandler = require("../handler.js").globalHandler;
const db = require("../../services").db;

const data = {
  name: "scoreboard",
  type: 1,
  description: "get a scoreboard for the current month",
};

const _action = async () => {
  const allUsers = await getAllUsers();
  const allScores = allUsers
    .sort((u1, u2) => u1.numCycleChores - u2.numCycleChores)
    .map((u) => `${u.displayName}: ${u.numCycleChores}`);

  let response = {
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
