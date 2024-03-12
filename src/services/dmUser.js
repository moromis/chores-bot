exports.dmUser = async (client, userId, message) => {
  const user = await client.users.fetch(userId);
  if (!user.bot) {
    await user.send(message);
  }
};
