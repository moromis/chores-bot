const messageChoresChannel = async (client, message) => {
  const CHANNEL_ID = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(CHANNEL_ID);
  await channel.send(message);
};

module.exports = {
  messageChoresChannel,
};
