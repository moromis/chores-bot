const { mockClient } = require("aws-sdk-client-mock");
const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  BatchWriteItemCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { db } = require(".");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const dbMock = mockClient(DynamoDBClient);
const documentMock = mockClient(DynamoDBDocumentClient);

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

  describe("batchWrite", () => {
    test("if no items is given, no commands should be issued", async () => {
      await db.batchWrite("test");
      expect(documentMock.calls.length).toBe(0);
    });
    test("if an empty array is given, no commands should be issued", async () => {
      await db.batchWrite("test", []);
      expect(documentMock.calls.length).toBe(0);
    });
    test("if items are given, batchwrite should be called", async () => {
      documentMock.on(BatchWriteItemCommand).resolves({});
      await db.batchWrite("test", [{ item: "test" }]);
      expect(documentMock.send.called).toBeTruthy();
    });
    test("if write errors, the function should return the error", async () => {
      documentMock.on(BatchWriteItemCommand).rejects("error");

      const res = db.batchWrite("test", [{ item: "test" }]);
      await expect(res).rejects.toEqual(new Error("error"));
    });
  });

  describe("put", () => {
    test("if no item is given, no calls should be made", async () => {
      await db.put("test");
      expect(documentMock.calls.length).toBe(0);
    });
    test("if an item is given, put should be called", async () => {
      documentMock.on(PutItemCommand).resolves({});
      await db.put("test", { item: "test" });
      expect(documentMock.send.called).toBeTruthy();
    });
    test("if write errors, the function should return the error", async () => {
      documentMock.on(PutItemCommand).rejects("error");

      await expect(db.put("test", { item: "test" })).rejects.toEqual(
        new Error("error")
      );
    });
  });
});
