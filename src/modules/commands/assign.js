const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const services = require("../../services");
const {
  removeRandomFromList,
} = require("../../helpers/removeRandomFromList.js");
const { getChoreMessage } = require("../../helpers/getChoreMessage.js");
const { Client, GatewayIntentBits } = require("discord.js");

const globalHandler = require("../handler.js");
const strings = require("../../constants/strings.js");
const db = require("../../services/index.js").db;

const data = {
  name: "assign",
  type: 1,
  description: "assigns a user a chore if they don't have one",
};

const _action = async (body) => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  const userId = body.member.user.id;
  const allUsers = await services.updateUsers(client); // TODO: maybe we should actually only update users in weekly and maybe monthly?
  const user = allUsers.find((u) => u.id === userId);
  if (user.hasOwnProperty("currentChore")) {
    // IMPORTANT: destroy the discord.js client, otherwise the application hangs
    await client.destroy();
    return {
      content: strings.USER_HAS_CHORE,
    };
  }

  let newChore;
  let choresToPickFrom = await services.getTodoChores();
  if (choresToPickFrom.length === 0) {
    // TODO: big deal here! celebrate all chores being done!
    await services.unassignCompletedChores();
    choresToPickFrom = await services.getTodoChores();
  }
  newChore = removeRandomFromList(choresToPickFrom);

  // get a reviewer
  const assignedChores = await services.getIncompleteChores();
  const currentReviewers = assignedChores
    .filter((c) => c.hasOwnProperty("reviewer"))
    .map((c) => c.reviewer);
  const potentialReviewers = allUsers.filter(
    (u) => !currentReviewers.includes(u.id) && u.id !== user.id,
  );

  if (potentialReviewers.length == 0) {
    // IMPORTANT: destroy the discord.js client, otherwise the application hangs
    await client.destroy();
    return {
      content: strings.NO_REVIEWERS,
    };
  }

  const reviewer = removeRandomFromList(potentialReviewers);
  if (newChore) {
    newChore = {
      ...newChore,
      user: user,
      reviewer: reviewer,
      status: CHORE_STATES.ASSIGNED,
    };
    await db.put(TABLES.CHORES, newChore);
    await db.put(TABLES.USERS, {
      ...user,
      inactive: false,
      currentChore: newChore.id,
    });
  }

  let response;
  if (newChore) {
    response = {
      content: `<@${userId}> Your new chore is\n${getChoreMessage(newChore)}`,
    };
  } else {
    response = {
      content: strings.UNABLE_TO_ASSIGN_CHORE,
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
