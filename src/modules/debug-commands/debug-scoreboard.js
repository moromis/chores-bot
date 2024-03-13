const dotenv = require("dotenv");
const _action = require("../commands/scoreboard")._action;

dotenv.config();

_action().then((result) => {
  console.log(result);
});
