const { CHORE_ROLE } = require("../constants/roles");
const { TABLES } = require("../constants/tables");
const services = require("../services");

exports.addNewUsers = async (client) => {
  const newUsers = [];
  const guild = client.guilds.resolve(process.env.GUILD_ID);
  const members = await guild.members.fetch({ force: true });
  const allRoleUsers = members
    .filter((m) => {
      return m.roles.cache.find((r) => r.name === CHORE_ROLE);
    })
    .map((u) => {
      const newUser = { id: u.id, displayName: u.displayName };
      return newUser;
    });

  // get all users
  let users = await services.getAllUsers();
  const userIds = users.map((u) => u.id);

  allRoleUsers.filter((u) => {
    if (!userIds.includes(u.id)) {
      newUsers.push({
        ...u,
        numCycleChores: 0,
        numAllTimeChores: 0,
      });
    }
  });
  if (newUsers.length > 0) {
    await services.db.batchWrite(TABLES.USERS, newUsers);
    users = await services.getAllUsers();
  }

  return users;
};
