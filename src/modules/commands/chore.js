const services = require("../../services");
const { Client, GatewayIntentBits } = require("discord.js");

const globalHandler = require("../handler.js");
const strings = require("../../constants/strings.js");
const getCurrentChoreMessage = require("../../helpers/getCurrentChoreMessage.js");

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

  const user = await services.getUser(body.member.user.id);
  let chore;
  if (user) {
    chore = await services.getChore(user.currentChore);
  }

  if (chore) {
    console.log("got chore ", chore);
    await services.dmUser(client, user.id, getCurrentChoreMessage(chore));
  } else {
    // IMPORTANT: destroy the discord.js client, otherwise the application hangs
    await client.destroy();

    return {
      content: strings.MAYBE_NO_CHORE,
    };
  }

  // IMPORTANT: destroy the discord.js client, otherwise the application hangs
  await client.destroy();

  return {
    delete: true,
  };
};

function handler(event) {
  globalHandler(event, _action);
}

module.exports = {
  data,
  handler,
  _action,
};
