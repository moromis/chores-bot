const getChoreCompleteMessage = (userId) =>
  `<@${userId}> You completed your chore! :tada: Type \`/assign\` if you want another one.`;
module.exports = getChoreCompleteMessage;
