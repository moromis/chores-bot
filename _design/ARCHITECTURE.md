# Commands
- /swap: swaps your current chore for a different one. notifies the channel
- /complete: sets your current chore to complete and notifies your reviewer (dm)
- /chore: lists your chore details
- /assign: gets a new chore if you don't have one
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
        inactive
        extraPointage
            ↖_ this is just an arbitrary metric that tells the bot how many extra points to award a user each week, depending on
                your particular use case. ours is that particular people take out and bring in garbage and recycling, and only they
                do so each week. thus they get an extra point every week.
        * currentChore (-> chores)

chores
    chore
        id
        displayName
        description
        status [one of: todo, assigned, complete]
        * reviewer (-> users) - can be null
        * user (-> users) - can be null