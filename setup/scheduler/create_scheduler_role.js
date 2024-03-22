const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { create_template_string } = require("./scheduler_role_template");
dotenv.config({
  path: !!process.env.DEV === true ? "../../.dev.env" : "../../.env",
});

console.log(
  "generating scheduler role json using AWS account ",
  process.env.AWS_ID
);

if (!process.env.AWS_ID) {
  throw "You must define all variables in the .env file (see readme for more details)";
}

const main = () => {
  const template = create_template_string();

  fs.writeFileSync(
    path.join(__dirname, "scheduler_role.json"),
    template,
    "utf-8"
  );
  console.log("File scheduler_role.json generated successfully.");
  return;
};

main();
