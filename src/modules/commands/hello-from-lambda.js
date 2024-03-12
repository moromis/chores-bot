/**
 * A Lambda function that replies to interaction with static string
 */

const globalHandler = require("../handler.js").globalHandler;

const data = {
  name: "hello",
  type: 1,
  description: "replies with hello world.",
};

const action = async (body) => {
  // May do something here with body
  // Body contains Discord command details
  let response = {
    content: "Hello from Lambda!",
  };
  return response;
};

function handler(event) {
  globalHandler(event, action);
}

module.exports = {
  data,
  handler,
};
