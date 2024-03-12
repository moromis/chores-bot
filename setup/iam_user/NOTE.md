This isn't working just yet, but this would setup all the permissions you need for your bot/user IAM account to do everything related to this app.

The full list of permissions that should be rolled into a single policy, ideally is:
- IAMFullAccess
- CloudWatchEventsFullAccess
- AWSLambda_FullAccess
- AWSCodeDeployRoleForLambda
- AWSCloudFormationFullAccess
- AmazonSNSFullAccess
- AmazonS3FullAccess
- AmazonDynamoDBFullAccess
- AmazonAPIGatewayAdministrator