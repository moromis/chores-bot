// Import required AWS SDK clients and commands for Node.js
const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const fs = require("fs");

const dynamoTableName = "users";
const rawdata = fs.readFileSync("users.json");
let json_data = JSON.parse(rawdata);

// Set the AWS Region
const REGION = "us-east-2"; //e.g. "us-east-1"
const dbclient = new DynamoDBClient({ region: REGION });

// JSON - Insert to Dynamo Table
const insertToDynamoTable = async function (json) {
  try {
    let dynamoDBRecords = getDynamoDBRecords(json);
    var batches = [];

    while (dynamoDBRecords.length) {
      batches.push(dynamoDBRecords.splice(0, 25));
    }

    await callDynamoDBInsert(batches);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const callDynamoDBInsert = async function (batches) {
  return Promise.all(
    batches.map(async (batch) => {
      requestItems = {};
      requestItems[dynamoTableName] = batch;

      var params = {
        RequestItems: requestItems,
      };

      await dbclient.send(new BatchWriteItemCommand(params));
    })
  );
};

// Get DynamoDB records from json
const getDynamoDBRecords = function (data) {
  let dynamoDBRecords = data.map((entity, i) => {
    entity = marshall({
      id: `${entity.id}`,
      ...entity,
    });
    console.log(entity);
    let dynamoRecord = Object.assign({ PutRequest: { Item: entity } });
    return dynamoRecord;
  });

  return dynamoDBRecords;
};

// Create DynamoDB service object
const run = async () => {
  try {
    const data = await insertToDynamoTable(json_data);
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};
run();
