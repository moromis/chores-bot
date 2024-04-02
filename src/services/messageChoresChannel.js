const messageChoresChannel = async (client, message) => {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  await channel.send(message);
};

module.exports = {
  messageChoresChannel,
};
