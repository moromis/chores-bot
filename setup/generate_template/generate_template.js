const dotenv = require("dotenv");
const path = require("path");
const { yamlParse, yamlDump } = require("yaml-cfn");
const fs = require("fs");
const {
  create_template_yaml_string,
} = require("./create_template_yaml_string");
dotenv.config({ path: "../../.env" });

if (
  !process.env.PUBLIC_KEY ||
  !process.env.CHANNEL_ID ||
  !process.env.BOT_TOKEN ||
  !process.env.GUILD_ID
) {
  throw "You must define all variables in the .env file (see readme for more details)";
}

const main = () => {
  const template = create_template_yaml_string();

  fs.writeFileSync(
    path.join(__dirname, "..", "..", "template.yaml"),
    template,
    "utf-8"
  );
  console.log("File template.yaml generated successfully.");
  return;
};

main();
