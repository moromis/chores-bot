const USER_HAS_CHORE =
  "You already have a chore. Use `/swap` if you want a different one, or use `/chore` to see what your current chore is.";
const NO_REVIEWERS =
  "Something's wrong and we couldn't find a reviewer for you.";
const UNABLE_TO_ASSIGN_CHORE = "Failed to assign a chore.";
const NO_ASSIGNED_CHORE =
  "You don't have an assigned chore right now. Type `/assign`";
const MAYBE_NO_CHORE =
  "Couldn't find your chore. Maybe you need to do `/assign`?";
const SWAP_FAILED = "Failed to swap for a new chore.";

const strings = {
  USER_HAS_CHORE,
  NO_REVIEWERS,
  UNABLE_TO_ASSIGN_CHORE,
  NO_ASSIGNED_CHORE,
  SWAP_FAILED,
  MAYBE_NO_CHORE,
};

module.exports = strings;
