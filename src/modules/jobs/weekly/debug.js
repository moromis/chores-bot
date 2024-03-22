const dotenv = require("dotenv");
const handler = require("./weekly").handler;

dotenv.config({
  path:
    !!process.env.DEV === true ? "../../../../.dev.env" : "../../../../.env",
});
handler();
