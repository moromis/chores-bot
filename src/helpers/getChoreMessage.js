exports.getChoreMessage = (chore) => {
  if (!chore || !chore.displayName || !chore.description) {
    return "Chore not found";
  }
  return `**Chore**: ${chore.displayName}\n**Description**: ${chore.description}\n**Reviewer**: <@${chore.reviewer}>`;
};
