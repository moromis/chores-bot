const db = require("./db");
const TABLES = require("../constants/tables").TABLES;

const getUser = async (userId) => {
  // get all users from DynamoDB
  return await db.getItem(TABLES.USERS, userId);
};

module.exports = {
  getUser,
};
