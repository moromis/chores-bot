const { getChoreMessage } = require("./getChoreMessage");

const getCurrentChoreMessage = (chore) =>
  `Your current chore is\n${getChoreMessage(chore)}`;

module.exports = getCurrentChoreMessage;
