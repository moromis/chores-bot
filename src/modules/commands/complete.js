const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const { dmUser } = require("../../services/dmUser.js");
const { getAllChores } = require("../../services/getChores.js");
const _ = require("lodash");
const { Client, GatewayIntentBits } = require("discord.js");

const globalHandler = require("../handler.js").globalHandler;
const db = require("../../services").db;

const data = {
  name: "complete",
  type: 1,
  description: "mark your chore as complete",
};

const action = async (body) => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  const userId = body.member.user.id;

  const allChores = await getAllChores();
  const chore = allChores.find((c) => c?.user?.id === userId);
  if (chore) {
    await db.put(TABLES.CHORES, {
      ..._.omit(chore, ["user", "reviewer"]),
      status: CHORE_STATES.COMPLETE,
    });
    await db.put(TABLES.USERS, {
      ..._.omit(chore.user, ["currentChore"]),
      numCycleChores: chore.user.numCycleChores + 1,
      numAllTimeChores: chore.user.numAllTimeChores + 1,
    });
  } else {
    return {
      content: `You don't have an assigned chore right now. Type \`/assign\``,
    };
  }

  await dmUser(
    client,
    chore.reviewer.id,
    `<@${userId}> is done with their chore. You're their reviewer, so please check their work.\n${getChoreMessage(
      chore
    )}`
  );

  let response = {
    content: `<@${userId}> You completed your chore! :tada: Type \`/assign\` if you want another one.`,
  };

  await client.destroy();

  return response;
};

function handler(event) {
  globalHandler(event, action);
}

module.exports = {
  data,
  handler,
};
