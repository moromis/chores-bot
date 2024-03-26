const TABLES = require("../../../constants/tables").TABLES;
const getMonthEndMessage = require("../../../helpers/getMonthEndMessage");
const services = require("../../../services");
const { Client, GatewayIntentBits } = require("discord.js");

exports.handler = async () => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  // update users if needed, based on the "chore-boy" role
  const activeUsers = (await services.updateUsers(client))?.filter(
    (u) => !u.inactive,
  );
  const scores = activeUsers?.sort(
    (u1, u2) => u2.numCycleChores - u1.numCycleChores,
  );

  if (activeUsers?.length > 0) {
    await services.messageChoresChannel(client, getMonthEndMessage(scores));

    await services.db.batchWrite(
      TABLES.USERS,
      activeUsers.map((user) => ({
        ...user,
        numCycleChores: 0,
      })),
    );
  }

  // IMPORTANT: destroy the discord.js client, otherwise the application hangs
  await client.destroy();
};
