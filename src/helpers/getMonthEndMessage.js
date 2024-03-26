const getMonthEndMessage = (scores) => {
  const lowestScoring = scores[scores.length - 1];
  return `## @everyone The month is over!\n<@${
    lowestScoring.id
  }> You're buying the pizza for the next house meeting. You only finished ${
    lowestScoring.numCycleChores
  } chores this month. Here's how everyone did:\n${scores
    .map((u) => `${u.displayName}: ${u.numCycleChores}`)
    .join("\n")}`;
};

module.exports = getMonthEndMessage;
