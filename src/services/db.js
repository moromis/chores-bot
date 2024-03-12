const {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const DynamoDBDocumentClient =
  require("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const REGION = "us-east-2"; //e.g. "us-east-1"
const client = new DynamoDBClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(client);

// NOTE: these methods return promises

const put = (tableId, item) => {
  return dynamo.send(
    new PutItemCommand({
      TableName: tableId,
      Item: marshall(item),
    })
  );
};

const batchWrite = async function (tableId, items) {
  const marshalledItems = items.map((x) => {
    const marshalled = marshall(x);
    return Object.assign({ PutRequest: { Item: marshalled } });
  });
  try {
    const batches = [];

    while (marshalledItems.length) {
      batches.push(marshalledItems.splice(0, 25));
    }

    return Promise.all(
      batches.map(async (batch) => {
        requestItems = {};
        requestItems[tableId] = batch;

        const params = {
          RequestItems: requestItems,
        };

        dynamo.send(new BatchWriteItemCommand(params));
      })
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

const scan = async (tableId) => {
  const res = await dynamo.send(new ScanCommand({ TableName: tableId }));
  const items = res?.["Items"];
  return items ? items.map(unmarshall) : [];
};

module.exports = { put, scan, batchWrite };
