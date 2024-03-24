const axios = require("axios").default;

async function globalHandler(event, action) {
  /*
   * Should be changed to respond differently depending on interaction type.
   * Now it only edits "Loading..." message, therefore only answers to
   * text interactions.
   */
  const body = JSON.parse(event.Records[0].Sns.Message);
  const response = await action(body);
  if (response.delete) {
    axios
      .delete(
        `https://discord.com/api/v10/webhooks/${body.application_id}/${body.token}/messages/@original`,
      )
      .catch(function (error) {
        console.log(error);
      });
  } else {
    axios
      .patch(
        `https://discord.com/api/v10/webhooks/${body.application_id}/${body.token}/messages/@original`,
        response,
      )
      .catch(function (error) {
        console.log(error);
      });
  }
}

module.exports = {
  globalHandler,
};
