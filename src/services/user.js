const db = require("./db");
const TABLES = require("../constants/tables").TABLES;
const { CHORE_ROLE, GARBAGE_ROLE } = require("../constants/roles");
const services = require(".");
const _ = require("lodash");

const getAllUsers = async () => {
  // get all users from DynamoDB
  return await db.scan(TABLES.USERS);
};

const updateUsers = async (client) => {
  const guild = client.guilds.resolve(process.env.GUILD_ID);
  const members = await guild.members.fetch({ force: true });
  const currentUserList = members
    .filter((m) => {
      return m.roles.cache.find(
        (r) => r.name === CHORE_ROLE || r.name === GARBAGE_ROLE
      );
    })
    .map((u) => {
      return {
        id: u.id,
        displayName: u.displayName,
        ...(u.roles.cache.find((r) => r.name === GARBAGE_ROLE)
          ? { extraPointage: 1 }
          : {}),
      };
    });
  const currentUserIds = currentUserList.map((u) => u.id);

  // get all users
  let dbUserList = await getAllUsers();
  // new users are ones that are in the current collection but weren't in the DB
  const newUsers = _.differenceBy(currentUserList, dbUserList, "id");
  // users that are now inactive are ones that were in the DB but aren't in our current list
  const inactiveUsers = _.differenceBy(dbUserList, currentUserList, "id");
  // current users, to keep
  const currentUsers = _.intersectionBy(dbUserList, currentUserList, "id");

  // create list of current users
  const users = [
    ...newUsers.map((u) => ({
      ...u,
      numCycleChores: 0,
      numAllTimeChores: 0,
      inactive: false,
    })),
    ...inactiveUsers.map((u) => ({
      ...u,
      inactive: true,
    })),
    ...currentUsers.map((u) => ({
      ...u,
      inactive: currentUserIds.includes(u.id) ? false : true,
    })),
  ];

  if (users.length > 0) {
    await services.db.batchWrite(TABLES.USERS, users);
  }

  return users;
};

const getUser = async (userId) => {
  // get all users from DynamoDB
  return await db.getItem(TABLES.USERS, userId);
};

module.exports = {
  getAllUsers,
  getUser,
  updateUsers,
};
