const db = require("./db");
const TABLES = require("../constants/tables").TABLES;

const getAllUsers = async () => {
  // get all users from DynamoDB
  return await db.scan(TABLES.USERS);
};

module.exports = {
  getAllUsers,
};
