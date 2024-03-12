user_id=$(aws sts get-caller-identity --query 'Account' --output text)

aws iam create-role --role-name BotExecutionRole --assume-role-policy-document file://role.json
aws iam create-policy --policy-name BotPolicy --policy-document file://policy.json
aws iam attach-role-policy --policy-arn arn:aws:iam::${user_id}:policy/BotPolicy --role-name BotExecutionRole