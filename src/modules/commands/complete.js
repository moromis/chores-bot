const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const services = require("../../services");
const _ = require("lodash");
const { Client, GatewayIntentBits } = require("discord.js");
const { getChoreMessage } = require("../../helpers/getChoreMessage.js");

const globalHandler = require("../handler.js").globalHandler;
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

  // const allChores = await getAllChores();
  // const chore = allChores.find((c) => c?.user?.id === userId);
  const user = await services.getUser(userId);
  const chore = await services.getChore(user.currentChore);
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
    return {
      content: "You don't have an assigned chore right now. Type `/assign`",
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
    content: `<@${userId}> You completed your chore! :tada: Type \`/assign\` if you want another one.`,
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
