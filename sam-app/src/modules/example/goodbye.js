/**
 * A Lambda function that replies to interaction with static string
 */

const { globalHandler } = require("../handler.js");

exports.data = {
  name: "goodbye",
  type: 1, // TODO: create enum for this
  description: "replies with goodbye world.",
};

const action = async (body) => {
  // May do something here with body
  // Body contains Discord command details
  let response = {
    content: "Goodbye world.",
  };
  return response;
};

exports.handler = (event) => {
  globalHandler(event, action);
};
