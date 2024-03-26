const { getChoreMessage } = require("./getChoreMessage");

const getChoreAssignedMessage = (userId, chore) =>
  `<@${userId}> Your new chore is\n${getChoreMessage(chore)}`;

module.exports = getChoreAssignedMessage;
