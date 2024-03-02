import axios from "axios";
import { readdirSync } from "fs";
import { join } from "path";

const loadCommands = async () => {
  let commandsOut = [];

  const commandsPath = join(
    __dirname,
    "..",
    "..",
    "src",
    "modules",
    "commands"
  );

  const commands = readdirSync(commandsPath).filter((x) => {
    return x.slice(-3) === ".js";
  });

  for await (const command of commands) {
    const { data } = require(`${commandsPath}/${command}`);
    commandsOut.push(data);
  }
  return commandsOut;
};

export async function register(appId, botToken, guildId) {
  const commands = await loadCommands();
  const headers = {
    Authorization: `Bot ${botToken}`,
    "Content-Type": "application/json",
  };

  const globalUrl = `https://discord.com/api/v10/applications/${appId}/commands`;
  const guildUrl = `https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`;
  endpoint = guildId ? guildUrl : globalUrl;
  cmdInfo = guildId ? "Guild" : "Global";

  axios
    .put(endpoint, JSON.stringify(commands), { headers: headers })
    .then(() => console.log(`${cmdInfo} Commands registered.`))
    .catch((e) => {
      console.warn(e.statusMessage);
    });
  return;
}
