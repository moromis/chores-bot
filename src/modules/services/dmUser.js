export const dmUser = async (userId, message) => {
  const user = await client.users.fetch(userId);
  await user.send(message);
};
