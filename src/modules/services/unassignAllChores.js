import services from ".";
import { CHORE_STATES } from "../../../constants/chores";

export const unassignAllChores = async () => {
  const incompleteChores = services.getIncompleteChores();
  await Promise.all(
    incompleteChores.map((chore) => {
      services.db.put(tableName, { ...chore, status: CHORE_STATES.TODO });
    })
  );
};
