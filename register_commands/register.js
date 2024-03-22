const dotenv = require("dotenv");
const register = require("./misc/send.js").register;
dotenv.config({
  path: !!process.env.DEV === true ? "../.dev.env" : "../.env",
});

console.log("registering commands using AWS account ", process.env.AWS_ID);

if (!process.env.APP_ID || !process.env.BOT_TOKEN) {
  throw "You must define APP_ID and BOT_TOKEN in .env file or in a command line run (e.g. APP_ID=1234 BOT_TOKEN=ABCD node register_commands/register.js)";
}

register(process.env.APP_ID, process.env.BOT_TOKEN, process.env.GUILD_ID);
