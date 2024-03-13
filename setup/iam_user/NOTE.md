this is to automatically setup an iam user and policy, and attach the policy to the user, such that that user 

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