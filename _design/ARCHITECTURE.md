# Commands
- /swap: swaps your current chore for a different one. notifies the channel
- /complete: sets your current chore to complete and notifies your reviewer (dm)
- ? /list: lists unassigned chores
- ? /pick <chore>: picks a particular chore and assigns it to you. will unassign an incomplete chore if you have one
- /scoreboard <?user>: shows how many chores all users or a particular user have done in the current cycle (generally a month)
- /history <?user>: shows how many chores a user has done in their lifetime

# Passive events
- every Sunday
    - shame incomplete chores, return to unassigned
    - calculate and notify new chores
- every day
    - ephemerally remind all users of their chore, if not done


# Schemas
users
    user
        id
        displayName
        numCycleChores
        numAllTimeChores
        * currentChore (-> chores)

chores
    chore
        id
        displayName
        description
        status [one of: todo, assigned, complete]
        * reviewer (-> users) - can be null
        * user (-> users) - can be null