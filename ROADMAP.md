# Roadmap
## TODO
- check if morning cron ran
- write tests for everything
  - aim for coverage of >= 80%
- once all chores are completed, let the house know to celebrate!
- User-based score board: shows precisely which chores the provided user has done in the current chore cycle
- add deployment scripts for each command/job so pieces can be deployed separately

## Done
- Send (ephemeral) message to each user based on their particular chore at midnight every day, to remind them of what they're currently scheduled to do
- Assign a reviewer for every user, randomly selected without replacement. Ping that reviewer when the user marks their chore as done -- no need to get fancy and have them do anything bot-wise in Discord, they should just go check the work in-person and then sync with their reviewee if needed, otherwise give them an in-person or virtual thumbs up
- Change to new chore schedule each Sunday
- On Sunday at midnight send message @ing all users what their new chore is for the week
- Allow users to:
  - ask to swap for a different chore, returning their current one to the pool
  - complete a task, putting it into a done category
  - ask for a new chore -- if their current chore is not done, put it back and get a new one, otherwise give them a new one and notify ephemerally what it is
- once Sunday rolls back around, if the to-do list is empty, i.e. all chores have been completed, or if there is not enough for all users, assign everything there is and then reset the completed stack back into to-do.
- On Sunday, if someone did not complete their chore for the week, shame them publicly and return their chore to the to-do list before doling out new tasks
- Score board: basic, shows how many chores each person has done in the current cycle
- Historical score board: shows how many chores each person has done ever
- at the end of the cycle (e.g. monthly):
  - (?) the person who did the least chores owes everyone pizza or something like that
  - reset the numCycleChores for all users
- make single, deployable iam user/policy for main user agent