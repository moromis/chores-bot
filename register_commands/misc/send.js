const path = require("path");
const axios = require("axios").default;
const fs = require("fs");

const loadCommands = async () => {
  let commandsOut = [];

  const commandsPath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "modules",
    "commands"
  );

  const commands = fs.readdirSync(commandsPath).filter((x) => {
    return x.slice(-3) === ".js";
  });

  for await (const command of commands) {
    const { data } = require(`${commandsPath}/${command}`);
    commandsOut.push(data);
  }
  return commandsOut;
};

exports.register = async (appId, botToken, guildId) => {
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
};
