const { CHORE_STATES } = require("../../constants/chores.js");
const { TABLES } = require("../../constants/tables.js");
const services = require("../../services");
const _ = require("lodash");
const {
  removeRandomFromList,
} = require("../../helpers/removeRandomFromList.js");
const getChoreAssignedMessage = require("../../helpers/getChoreAssignedMessage.js");

const globalHandler = require("../handler.js");
const strings = require("../../constants/strings.js");
const db = require("../../services").db;

const data = {
  name: "swap",
  type: 1,
  description: "swap your current chore for a new one",
};

const _action = async (body) => {
  const userId = body.member.user.id;

  const user = await services.getUser(userId);
  const oldChore = await services.getChore(user.currentChore);
  let newChore;
  if (!oldChore) {
    return {
      content: strings.NO_ASSIGNED_CHORE,
    };
  } else {
    const choresToPickFrom = await services.getTodoChores();
    newChore = removeRandomFromList(choresToPickFrom);

    if (newChore) {
      newChore = {
        ...newChore,
        user: oldChore.user,
        reviewer: oldChore.reviewer,
        status: CHORE_STATES.ASSIGNED,
      };
      await db.put(TABLES.USERS, {
        ...user,
        currentChore: newChore.id,
      });
      await db.batchWrite(TABLES.CHORES, [
        newChore,
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
      content: getChoreAssignedMessage(userId, newChore),
    };
  } else {
    response = {
      content: strings.SWAP_FAILED,
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
  _action,
};
