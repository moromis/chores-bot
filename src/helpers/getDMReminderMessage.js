const strings = require("../constants/strings");
const { getChoreMessage } = require("./getChoreMessage");

exports.getDMReminderMessage = (days, chore) => {
  let timeString = `you have ${days} ${days === 1 ? "day" : "days"}`;
  if (days === 0) {
    timeString = strings.LAST_DAY;
  }
  return `### Reminder: ${timeString} to do your chore.\n${getChoreMessage(
    chore,
  )}`;
};
