const printMonthlyScoreboard = (sortedUsers) => {
  const sortedScores = sortedUsers.map(
    (u) => `${u.displayName}: ${u.numCycleChores}`,
  );
  return `## Monthly Scoreboard\n${sortedScores.join("\n")}`;
};

module.exports = {
  printMonthlyScoreboard,
};
