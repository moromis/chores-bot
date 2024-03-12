const dotenv = require("dotenv");
const handler = require("./weekly").handler;

dotenv.config({ path: "../../../../.env" });
handler();
