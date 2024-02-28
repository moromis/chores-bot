const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "http-crud-tutorial-items";

exports.handler = async (event) => {
  const CHANNEL_ID = process.env.CHANNEL_ID;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // Create a new client instance
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  await client.login(BOT_TOKEN);

  console.log("done logging in");

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: "chair",
        price: 60,
        name: "A Cool Chair",
      },
    })
  );

  body = await dynamo.send(new ScanCommand({ TableName: tableName }));
  const items = body.Items;

  console.log(items);

  const channel = await client.channels.fetch(CHANNEL_ID);
  await channel.send("Updated on sale items: ");

  await Promise.all(
    items.map(async (item) => {
      await channel.send(JSON.stringify(item));
    })
  );

  return {
    statusCode: 200,
  };
};
