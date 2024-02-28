TODO: implement this using scheduler_role.json

take in user id as param

command: aws iam create-role --role-name SchedulerExecutionRole --assume-role-policy-document file://scheduler_role.json
then: aws iam create-policy --policy-name SchedulerPolicy --policy-document file://scheduler_policy.json
finally: aws iam attach-role-policy --policy-arn arn:aws:iam::${user_id}:policy/SchedulerPolicy --role-name SchedulerExecutionRole