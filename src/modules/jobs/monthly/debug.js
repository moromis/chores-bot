const dotenv = require("dotenv");
const handler = require("./monthly").handler;

dotenv.config({ path: "../../../../.env" });
handler();
