let channel = null;

export const messageChoresChannel = async (client, message) => {
  if (channel === null) {
    const CHANNEL_ID = process.env.CHANNEL_ID;
    channel = await client.channels.fetch(CHANNEL_ID);
  }
  await channel.send(message);
};
