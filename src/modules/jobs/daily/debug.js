const dotenv = require("dotenv");
const handler = require("./daily").handler;

dotenv.config({
  path:
    !!process.env.DEV === true ? "../../../../.dev.env" : "../../../../.env",
});
handler();
