const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const tweetnacl = require("tweetnacl");

async function handler(event) {
  const strBody = event.body; // should be string, for successful sign

  if (!event.headers["test"]) {
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature =
      event.headers["x-signature-ed25519"] ||
      event.headers["X-Signature-Ed25519"];
    const timestamp =
      event.headers["x-signature-timestamp"] ||
      event.headers["X-Signature-Timestamp"];

    const isVerified = tweetnacl.sign.detached.verify(
      Buffer.from(timestamp + strBody),
      Buffer.from(signature, "hex"),
      Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
      console.error("401 return code");
      return {
        statusCode: 401,
        body: JSON.stringify("invalid request signature"),
      };
    }
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }

  // Handle command (send to SNS and split to one of Lambdas)
  if (body.data.name) {
    console.log(body.data.name);
    var eventText = JSON.stringify(body, null, 2);
    var params = {
      Message: eventText,
      Subject: "Test SNS From Lambda",
      TopicArn: process.env.TOPIC_ARN,
      MessageAttributes: {
        command: { DataType: "String", StringValue: body.data.name },
      },
    };
    console.log("sending ", params);
    // Create promise and SNS service object
    const snsClient = new SNSClient();
    await snsClient.send(new PublishCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: { content: "*⏳ Please Wait...*" },
      }),
    };
  }

  return {
    statusCode: 404,
  };
}

module.exports = {
  handler,
};
