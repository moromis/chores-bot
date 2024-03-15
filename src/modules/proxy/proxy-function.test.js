const { mockClient } = require("aws-sdk-client-mock");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const handler = require("./proxy-function").handler;

jest.mock("tweetnacl", () => {
  return {
    sign: {
      detached: {
        verify: () => false,
      },
    },
  };
});

const snsMock = mockClient(SNSClient);
snsMock.on(PublishCommand).resolves({});

const goodTestEvent = {
  body: JSON.stringify({
    type: 1,
    data: {
      name: "test",
    },
  }),
  headers: {
    test: true,
  },
};

const badTestEvent = {
  body: JSON.stringify({
    type: 2,
    data: {
      name: false,
    },
  }),
  headers: {
    test: true,
    "x-signature-ed25519": "asdf",
    "x-signature-timestamp": "asdf",
  },
};

describe("proxy function", () => {
  const OLD_ENV = process.env;

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  beforeEach(() => {
    jest.clearAllMocks;
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV, PUBLIC_KEY: "test" }; // Make a copy
  });
  beforeEach(() => {
    snsMock.reset();
  });

  test("it should return statusCode 200 when verified and body.type == 1", async () => {
    const res = await handler(goodTestEvent);
    expect(res.statusCode).toBe(200);
  });
  test("it should return statusCode 200 and body.type == 4 when verified and body.type != 1", async () => {
    goodTestEvent.body = JSON.stringify({
      ...JSON.parse(goodTestEvent.body),
      type: 2,
    });
    const res = await handler(goodTestEvent);
    expect(res.statusCode).toBe(200);
    const strBody = JSON.parse(res.body);
    expect(strBody.type).toBe(4);
    expect(strBody.data).toHaveProperty("content");
  });
  test("it should return statusCode 404 when verified and body.type != 1", async () => {
    const res = await handler(badTestEvent);
    expect(res.statusCode).toBe(404);
  });
  test("it should return statusCode 401 when unverified", async () => {
    badTestEvent.headers.test = false;
    const res = await handler(badTestEvent);
    expect(res.statusCode).toBe(401);
  });
});
