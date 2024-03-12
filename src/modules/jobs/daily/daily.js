const dayjs = require("dayjs");
const weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);
const CHORE_STATES = require("../../../constants/chores").CHORE_STATES;
const services = require("../../../services");
const { Client, GatewayIntentBits } = require("discord.js");
const { createDMMessage } = require("./createDMMessage");

exports.handler = async () => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  // Log in to Discord with your client's token
  await client.login(process.env.BOT_TOKEN);

  // get incomplete chores
  const incompleteChores = await services.getIncompleteChores();

  // for each incomplete chore, dm the user and remind them to do their chore
  await Promise.all(
    incompleteChores
      .filter((chore) => chore.status === CHORE_STATES.ASSIGNED)
      .map(async (chore) => {
        const { user } = chore;
        const nextSunday = dayjs().weekday(7);
        const now = dayjs();
        const days = nextSunday.diff(now, "days");

        await services.dmUser(client, user.id, createDMMessage(days, chore));
      })
  );
  // IMPORTANT: destroy the discord.js client, otherwise the application hangs
  await client.destroy();

  // TODO: logging here -- based on which promises return with a bad status?
};
