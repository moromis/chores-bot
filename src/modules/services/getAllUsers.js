import services from ".";
import { TABLES } from "../../../constants/tables";

export const getAllUsers = async () => {
  // get all users from DynamoDB
  const users = await services.db.scan(TABLES.USERS);
  return users;
};
