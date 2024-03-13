const axios = require("axios").default;
const globalHandler = require("./handler").globalHandler;

// Mock out all top level functions, such as get, put, delete and post:
jest.mock("axios");

const testAppId = "test-app-id";
const testToken = "test-token";
const testBody = JSON.stringify({
  application_id: testAppId,
  token: testToken,
});

const testEvent = {
  Records: [
    {
      Sns: {
        Message: testBody,
      },
    },
  ],
};

// default implementation
axios.patch.mockResolvedValue({});
axios.delete.mockResolvedValue({});

describe("global handler", () => {
  afterEach(jest.clearAllMocks);

  test("it should run the passed action", async () => {
    const testAction = jest.fn(() => Promise.resolve({}));
    await globalHandler(testEvent, testAction);
    expect(testAction).toHaveBeenCalled();
  });

  test("it should use axios.patch by default", async () => {
    const testAction = jest.fn(() => Promise.resolve({}));
    const axiosSpy = jest.spyOn(axios, "patch");
    await globalHandler(testEvent, testAction);
    expect(axiosSpy).toHaveBeenCalled();
  });

  test("it should call the discord v10 webhook with the action response", async () => {
    const testResponse = { content: "test" };
    const testAction = jest.fn(() => Promise.resolve(testResponse));
    const axiosSpy = jest.spyOn(axios, "patch");
    await globalHandler(testEvent, testAction);
    expect(axiosSpy).toHaveBeenCalledWith(
      `https://discord.com/api/v10/webhooks/${testAppId}/${testToken}/messages/@original`,
      testResponse
    );
  });

  test("it should use axios.delete if response has delete property", async () => {
    const testAction = jest.fn(() => Promise.resolve({ delete: true }));
    const axiosSpy = jest.spyOn(axios, "delete");
    await globalHandler(testEvent, testAction);
    expect(axiosSpy).toHaveBeenCalled();
  });
});
