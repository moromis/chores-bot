const CHORE_STATES = require("../../../constants/chores").CHORE_STATES;
const TABLES = require("../../../constants/tables").TABLES;
const services = require("../../../services");
const { Client, GatewayIntentBits } = require("discord.js");
const _ = require("lodash");
const dayjs = require("dayjs");
const {
  removeRandomFromList,
} = require("../../../helpers/removeRandomFromList");
const { getChoreMessage } = require("../../../helpers/getChoreMessage");

exports.handler = async () => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });
  // Log in to Discord with your client's token
  console.log("logging into Discord.js with ", process.env.BOT_TOKEN);
  await client.login(process.env.BOT_TOKEN);

  // send an initial "all done for the week" message to the channel
  const date = dayjs().format("DD/MM/YYYY");
  await services.messageChoresChannel(
    client,
    `# ${date}\n## Your time to do your chores is up! Let's see how we did.`,
  );

  // get all incomplete chores
  const incompleteChores = await services.getIncompleteChores();

  // create a single message: for each incomplete chore
  // add a shame with an @ for the particular user

  if (incompleteChores.length > 0) {
    await services.messageChoresChannel(client, "### Incomplete Chores");
    await Promise.all(
      incompleteChores.map(async (chore) => {
        const { displayName, user } = chore;
        await services.messageChoresChannel(
          client,
          `<@${user}> didn't finish their chore this week (${displayName})`,
        );
      }),
    );
  } else {
    await services.messageChoresChannel(
      client,
      "### Everyone finished their chore! Yahoo!!",
    );
  }

  // return incomplete chores to unassigned
  if (incompleteChores.length !== 0) {
    await services.unassignChores(incompleteChores);
  }

  // update users if needed, based on the "chore-boy" role
  const activeUsers = (await services.updateUsers(client)).filter(
    (u) => !u.inactive,
  );

  // duplicate users list to list named reviewers
  const reviewers = activeUsers;

  // make empty list named assignedChores
  const assignedChores = [];

  // get all unassigned chores
  let unassignedChores = await services.getTodoChores();

  // if the length of the unassigned chores list is 0, move all complete chores to unassigned
  if (unassignedChores.length === 0) {
    // TODO: big deal here! celebrate all chores being done! (should probably abstract to helper method
    // since we do this in more than one place)
    await services.unassignCompletedChores();
    unassignedChores = await services.getTodoChores();
  }

  const usersToWrite = [];

  await Promise.all(
    activeUsers.map(async (user) => {
      // if the length of the unassigned chores list is 0, move all complete chores to unassigned
      if (unassignedChores.length === 0) {
        // TODO: big deal here! celebrate all chores being done!
        await services.unassignCompletedChores();
        unassignedChores = await services.getTodoChores();
      }
      // pick a random user from reviewers list, remove from list
      const reviewer = removeRandomFromList(_.without(reviewers, user));

      // pick a random chore, change status to assigned, change user to user, change reviewer to reviewer
      const selectedChore = removeRandomFromList(unassignedChores);
      if (!selectedChore) {
        console.warn("unable to select a chore for ", user.displayName);
      } else {
        usersToWrite.push({
          ...user,
          currentChore: selectedChore.id,
          ...(user.extraPointage
            ? { numCycleChores: user.numCycleChores + user.extraPointage }
            : {}),
        });
        const choreToAssign = {
          ...selectedChore,
          status: CHORE_STATES.ASSIGNED,
          user: user.id,
          reviewer: reviewer.id,
        };
        // add chore to assignedChores list
        assignedChores.push(choreToAssign);
      }
    }),
  );

  // after loop: iterate over assignedChores (Promise.all) and send message for each to channel @ing user with their new chore,
  //             update user and chore in db
  console.log("number of assigned chores: ", assignedChores.length);
  await services.messageChoresChannel(client, "### New Chores");
  await Promise.all(
    assignedChores.map(async (chore) => {
      await services.messageChoresChannel(
        client,
        `**<@${chore.user}>**\n${getChoreMessage(chore)}`,
      );
    }),
  );

  // write all the new data to the db
  await services.db.batchWrite(TABLES.CHORES, assignedChores);
  await services.db.batchWrite(TABLES.USERS, usersToWrite);

  // IMPORTANT: destroy the discord.js client, otherwise the application hangs
  await client.destroy();

  console.log("done.");
};
