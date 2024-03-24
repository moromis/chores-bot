exports.dmUser = async (client, userId, message) => {
  if (!client || !userId || !message) return;
  const user = await client.users.fetch(userId);
  console.log(
    "going to try dming the user... are they a bot though? ",
    user.bot ? "yes." : "no.",
  );
  if (!user.bot) {
    await user.send(message);
  }
};
