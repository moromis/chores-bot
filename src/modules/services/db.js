import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

// NOTE: these methods return promises

const put = (tableId, item) => {
  return dynamo.send(
    new PutCommand({
      TableName: tableId,
      Item: item,
    })
  );
};

const scan = (tableId) => {
  return dynamo.send(new ScanCommand({ TableName: tableId }));
};

export default { put, scan };
