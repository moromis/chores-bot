# Commands
- /swap
- /complete
- ? /pick <chore>
- /scoreboard <?user>
- /history

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
        * currentChore (-> chores)

chores
    chore
        id
        displayName
        description
        status [one of: todo, assigned, complete]