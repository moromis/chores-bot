const printHistory = (sortedUsers) => {
  const sortedScores = sortedUsers.map(
    (u) => `${u.displayName}: ${u.numAllTimeChores}`,
  );
  return `## History\n${sortedScores.join("\n")}`;
};

module.exports = {
  printHistory,
};
