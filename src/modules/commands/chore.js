const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const services = require("../../services");
const _ = require("lodash");
const {
  removeRandomFromList,
} = require("../../helpers/removeRandomFromList.js");
const { getChoreMessage } = require("../../helpers/getChoreMessage.js");
const { addNewUsers } = require("../../services/addNewUsers.js");
const { Client, GatewayIntentBits } = require("discord.js");

const globalHandler = require("../handler.js").globalHandler;
const db = require("../../services/index.js").db;

const data = {
  name: "chore",
  type: 1,
  description: "sends the user details of their current chore",
};

const _action = async (body) => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  const user = await services.db.getItem(TABLES.USERS, body.member.user.id);
  let chore;
  if (user) {
    chore = await services.db.getItem(TABLES.CHORES, user.currentChore);
  }

  // TODO: dm the user these details and delete the Loading... message
  let response;
  if (chore) {
    response = {
      content: `<@${user.id}> Your current chore is\n${getChoreMessage(chore)}`,
    };
  } else {
    response = {
      content:
        "Something went wrong or else you don't have a chore. Maybe try `/assign`?",
    };
  }

  // IMPORTANT: destroy the discord.js client, otherwise the application hangs
  await client.destroy();

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