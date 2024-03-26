const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const services = require("../../services");
const _ = require("lodash");
const { Client, GatewayIntentBits } = require("discord.js");
const { getChoreMessage } = require("../../helpers/getChoreMessage.js");

const globalHandler = require("../handler.js");
const strings = require("../../constants/strings.js");
const getChoreCompleteMessage = require("../../helpers/getChoreCompleteMessage.js");
const db = require("../../services").db;

const data = {
  name: "complete",
  type: 1,
  description: "mark your chore as complete",
};

const _action = async (body) => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  const userId = body.member.user.id;

  const user = await services.getUser(userId);
  const chore = await services.getChore(user?.currentChore);
  if (chore) {
    await db.put(TABLES.CHORES, {
      ..._.omit(chore, ["user", "reviewer"]),
      status: CHORE_STATES.COMPLETE,
    });
    await db.put(TABLES.USERS, {
      ..._.omit(user, ["currentChore"]),
      numCycleChores: (user?.numCycleChores || 0) + 1,
      numAllTimeChores: (user?.numAllTimeChores || 0) + 1,
    });
  } else {
    await client.destroy();
    return {
      content: strings.NO_ASSIGNED_CHORE,
    };
  }

  await services.dmUser(
    client,
    chore.reviewer,
    `<@${userId}> is done with their chore. You're their reviewer, so please check their work.\n${getChoreMessage(
      chore,
    )}`,
  );

  await client.destroy();

  return {
    content: getChoreCompleteMessage(userId),
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
