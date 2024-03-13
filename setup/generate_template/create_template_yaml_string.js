exports.create_template_yaml_string = () => {
  return `AWSTemplateFormatVersion: 2010-09-09
Description: chores-discord-bot

Transform:
  - AWS::Serverless-2016-10-31

Parameters:
  StageName:
    Type: String
    Description: Stage Name used in API GW
    Default: Prod

Globals:
  Function:
    Timeout: 10

Resources:
  MainSNSTopic:
    Type: AWS::SNS::Topic

  proxyGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: Prod
      MethodSettings:
        - ResourcePath: /
          HttpMethod: ANY

  proxyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/modules/proxy/
      Handler: proxy-function.handler
      Runtime: nodejs20.x
      Architectures:
        - x86_64
      MemorySize: 128
      Description: Proxy function, calls other functions to handle slash commands
      Policies:
        - AWSLambdaBasicExecutionRole
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt MainSNSTopic.TopicName
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /
            Method: ANY
            RestApiId: !Ref proxyGateway
      Environment:
        Variables:
          TOPIC_ARN: !Ref MainSNSTopic
          PUBLIC_KEY: ${process.env.PUBLIC_KEY}

  Daily:
    Type: AWS::Serverless::Function
    Properties:
      Description: cron-scheduled daily function that reminds users with incomplete chores to do their chore
      CodeUri: src/
      Handler: modules/jobs/daily/daily.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
      Environment:
        Variables:
          CHANNEL_ID: ${process.env.CHANNEL_ID}
          BOT_TOKEN: ${process.env.BOT_TOKEN}

  Weekly:
    Type: AWS::Serverless::Function
    Properties:
      Description: cron-scheduled weekly function - unassigns old chores and assigns new ones
      CodeUri: src/
      Handler: modules/jobs/weekly/weekly.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
      Environment:
        Variables:
          CHANNEL_ID: ${process.env.CHANNEL_ID}
          BOT_TOKEN: ${process.env.BOT_TOKEN}
          GUILD_ID: ${process.env.GUILD_ID}

  Monthly:
    Type: AWS::Serverless::Function
    Properties:
      Description: cron-scheduled monthly function - resets points
      CodeUri: src/
      Handler: modules/jobs/monthly/monthly.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Environment:
        Variables:
          CHANNEL_ID: ${process.env.CHANNEL_ID}
          BOT_TOKEN: ${process.env.BOT_TOKEN}
          GUILD_ID: ${process.env.GUILD_ID}

  Complete:
    Type: AWS::Serverless::Function
    Properties:
      Description: complete chore command, also dms reviewer
      CodeUri: src/
      Handler: modules/commands/complete.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - complete
      Environment:
        Variables:
          BOT_TOKEN: ${process.env.BOT_TOKEN}

  Swap:
    Type: AWS::Serverless::Function
    Properties:
      Description: swap command, used to swap current chore for a new one
      CodeUri: src/
      Handler: modules/commands/swap.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - swap

  Assign:
    Type: AWS::Serverless::Function
    Properties:
      Description: assigns a new chore to a user
      CodeUri: src/
      Handler: modules/commands/assign.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - assign
      Environment:
        Variables:
          BOT_TOKEN: ${process.env.BOT_TOKEN}
          GUILD_ID: ${process.env.GUILD_ID}

  Chore:
    Type: AWS::Serverless::Function
    Properties:
      Description: tells the user what their current chore is
      CodeUri: src/
      Handler: modules/commands/chore.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref ChoresTable
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - chore
      Environment:
        Variables:
          BOT_TOKEN: ${process.env.BOT_TOKEN}

  Scoreboard:
    Type: AWS::Serverless::Function
    Properties:
      Description: get a scoreboard for the current month
      CodeUri: src/
      Handler: modules/commands/scoreboard.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - scoreboard

  History:
    Type: AWS::Serverless::Function
    Properties:
      Description: get a scoreboard of all history
      CodeUri: src/
      Handler: modules/commands/history.handler
      Runtime: nodejs20.x
      Architectures:
        - arm64
      MemorySize: 128
      Timeout: 100
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        SNSEvent:
          Type: SNS
          Properties:
            Topic: !Ref MainSNSTopic
            FilterPolicy:
              command:
                - history

  UsersTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String
      TableName: users

  ChoresTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String
      TableName: chores

  MonthlySchedule:
    Type: AWS::Scheduler::Schedule
    Properties:
      Description: schedule to do monthly tasks, such as resetting cycle points
      FlexibleTimeWindow: 
        Mode: "OFF"
      GroupName: default
      Name: monthly-schedule
      ScheduleExpression: cron(0 23 L * ? *)
      ScheduleExpressionTimezone: "America/Los_Angeles"
      Target:
        Arn: !GetAtt Monthly.Arn
        RoleArn: arn:aws:iam::${process.env.AWS_ID}:role/SchedulerExecutionRole

  WeeklySchedule:
    Type: AWS::Scheduler::Schedule
    Properties:
      Description: schedule to send out new chores etc. each Sunday at 12am
      FlexibleTimeWindow: 
        Mode: "OFF"
      GroupName: default
      Name: weekly-schedule
      ScheduleExpression: cron(0 23 ? * SUN *)
      ScheduleExpressionTimezone: "America/Los_Angeles"
      Target:
        Arn: !GetAtt Weekly.Arn
        RoleArn: arn:aws:iam::${process.env.AWS_ID}:role/SchedulerExecutionRole

  DailySchedule:
    Type: AWS::Scheduler::Schedule
    Properties:
      Description: schedule to remind people of their chores each day
      FlexibleTimeWindow: 
        Mode: "OFF"
      GroupName: default
      Name: daily-schedule
      ScheduleExpression: cron(0 6 ? * * *)
      ScheduleExpressionTimezone: "America/Los_Angeles"
      Target:
        Arn: !GetAtt Daily.Arn
        RoleArn: arn:aws:iam::${process.env.AWS_ID}:role/SchedulerExecutionRole   

Outputs:
  ProxyGWEndpoint:
    Description: API Gateway endpoint URL to pass to Discord Application Portal
    Value: !Sub >-
      https://\${proxyGateway}.execute-api.\${AWS::Region}.amazonaws.com/\${StageName}/
`;
};
