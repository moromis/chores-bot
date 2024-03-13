user_id=$(aws sts get-caller-identity --query 'Account' --output text)

aws iam create-user --user-name Bot
aws iam create-policy --policy-name BotPolicy --policy-document file://policy.json
aws iam attach-user-policy --policy-arn arn:aws:iam::${user_id}:policy/BotPolicy --user-name Bot