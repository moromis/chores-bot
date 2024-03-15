const { mockClient } = require("aws-sdk-client-mock");
const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { db } = require(".");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const dbMock = mockClient(DynamoDBClient);
const documentMock = mockClient(DynamoDBDocumentClient);
// documentMock.
// dbMock.on(ScanCommand).resolves({
//     Items: {
//         id: { S: "test" }
//     }
// });

describe("db", () => {
  beforeEach(() => {
    jest.clearAllMocks;
  });
  beforeEach(() => {
    dbMock.reset();
    documentMock.reset();
  });

  describe("scan", () => {
    test("if no items are received, an empty array should be returned", async () => {
      documentMock.on(ScanCommand).resolves({});
      const res = await db.scan("test");
      expect(res).toMatchObject([]);
    });
    test("if items are returned, they should be passed back marshalled", async () => {
      documentMock.on(ScanCommand).resolves({
        Items: [
          {
            id: { S: "test" },
          },
        ],
      });
      const res = await db.scan("test");
      expect(res).toHaveLength(1);
      expect(res[0]).toHaveProperty("id");
      expect(res[0].id).toBe("test");
    });
  });

  describe("getItem", () => {
    test("if no items are received, null should be returned", async () => {
      documentMock.on(GetItemCommand).resolves({});
      const res = await db.getItem("test");
      expect(res).toBeNull();
    });
    test("if an item is returned, it should be passed back marshalled", async () => {
      documentMock.on(GetItemCommand).resolves({
        Item: {
          id: { S: "test" },
        },
      });
      const res = await db.getItem("test");
      expect(res).toHaveProperty("id");
      expect(res.id).toBe("test");
    });
  });
});
