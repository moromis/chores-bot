const dotenv = require("dotenv");
const handler = require("./daily").handler;

dotenv.config({ path: "../../../../.env" });
handler();
