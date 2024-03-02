import services from ".";
import { CHORE_STATES } from "../../../constants/chores";

export const resetCompletedChores = async () => {
  const completedChores = await services.getCompletedChores();
  await Promise.all(
    completedChores.map((chore) => {
      services.db.put(tableName, { ...chore, status: CHORE_STATES.TODO });
    })
  );
};
