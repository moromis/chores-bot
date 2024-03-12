const dayjs = require("dayjs");

exports.createDMMessage = (days, chore) => {
  const { displayName, description } = chore;
  let timeString = `you have ${days} ${days === 1 ? "day" : "days"}`;
  if (days === 0) {
    timeString = `This is the last day`;
  }
  return `### Reminder: ${timeString} to do your chore.\n**Chore:** ${displayName}\n**Description**: ${description}`;
};
