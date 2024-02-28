// Import all functions from hello-from-lambda.js
const lambda = require("../../../src/modules/commands/hello-from-lambda.js");

// This includes all tests for helloFromLambdaHandler()
describe("Test for hello-from-lambda", function () {
  // This test invokes helloFromLambdaHandler() and compare the result
  it("Verifies successful response", async () => {
    // Invoke helloFromLambdaHandler()
    const { content } = await lambda._action();
    const expectedResult = "Hello from Lambda!";
    // Compare the result with the expected result
    expect(content).toEqual(expectedResult);
  });
});
