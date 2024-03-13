const dotenv = require("dotenv");
const _action = require("../commands/chore")._action;

dotenv.config();

const testBody = {
  member: {
    user: {
      id: process.env.MEMBER_ID,
    },
  },
};

_action(testBody);
