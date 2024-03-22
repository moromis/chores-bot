user_id=$(aws sts get-caller-identity --query 'Account' --output text)
echo $DEV
echo $AWS_PROFILE
echo $user_id

yarn
node create_scheduler_role.js
aws iam create-role --role-name SchedulerExecutionRole --assume-role-policy-document file://scheduler_role.json
aws iam create-policy --policy-name SchedulerPolicy --policy-document file://scheduler_policy.json
aws iam attach-role-policy --policy-arn arn:aws:iam::${user_id}:policy/SchedulerPolicy --role-name SchedulerExecutionRole