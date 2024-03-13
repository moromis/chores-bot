const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const { getAllChores, getTodoChores } = require("../../services/getChores.js");
const _ = require("lodash");
const {
  removeRandomFromList,
} = require("../../helpers/removeRandomFromList.js");
const { getChoreMessage } = require("../../helpers/getChoreMessage.js");

const globalHandler = require("../handler.js").globalHandler;
const db = require("../../services").db;

const data = {
  name: "swap",
  type: 1,
  description: "swap your current chore for a new one",
};

const _action = async (body) => {
  const userId = body.member.user.id;

  const allChores = await getAllChores();
  const oldChore = allChores.find((c) => c?.user?.id === userId);
  let newChore;
  if (!oldChore) {
    return {
      content: `You don't have an assigned chore right now. Type \`/assign\``,
    };
  } else {
    const choresToPickFrom = await getTodoChores();
    newChore = removeRandomFromList(choresToPickFrom);

    if (newChore) {
      await db.batchWrite(TABLES.CHORES, [
        {
          ...newChore,
          user: oldChore.user,
          reviewer: oldChore.reviewer,
          status: CHORE_STATES.ASSIGNED,
        },
        {
          ..._.omit(oldChore, ["user", "reviewer"]),
          status: CHORE_STATES.TODO,
        },
      ]);
    }
  }

  let response;
  if (newChore) {
    response = {
      content: `<@${userId}> Your new chore is\n${getChoreMessage(
        newChore
      )}\nYour reviewer is still <@${oldChore.reviewer.id}>`,
    };
  } else {
    response = {
      content: `Failed to swap for a new chore.`,
    };
  }

  return response;
};

function handler(event) {
  globalHandler(event, _action);
}

module.exports = {
  data,
  handler,
};
