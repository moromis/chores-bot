exports.create_template_string = () => `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "scheduler.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "${process.env.AWS_ID}",
                    "aws:SourceArn": "arn:aws:scheduler:us-east-2:${process.env.AWS_ID}:schedule-group/default"
                }
            }
        }
    ]
}`;
