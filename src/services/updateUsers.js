const { CHORE_ROLE } = require("../constants/roles");
const { TABLES } = require("../constants/tables");
const services = require(".");
const _ = require("lodash");

exports.updateUsers = async (client) => {
  const guild = client.guilds.resolve(process.env.GUILD_ID);
  const members = await guild.members.fetch({ force: true });
  const currentUserList = members
    .filter((m) => {
      return m.roles.cache.find((r) => r.name === CHORE_ROLE);
    })
    .map((u) => {
      return { id: u.id, displayName: u.displayName };
    });
  const currentUserIds = currentUserList.map((u) => u.id);

  // get all users
  let dbUserList = await services.getAllUsers();
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
