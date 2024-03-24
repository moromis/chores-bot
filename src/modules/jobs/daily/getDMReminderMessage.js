const { getChoreMessage } = require("../../../helpers/getChoreMessage");

exports.getDMReminderMessage = (days, chore) => {
  let timeString = `you have ${days} ${days === 1 ? "day" : "days"}`;
  if (days === 0) {
    timeString = "This is the last day";
  }
  return `### Reminder: ${timeString} to do your chore.\n${getChoreMessage(
    chore,
  )}`;
};
